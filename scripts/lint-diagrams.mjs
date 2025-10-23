#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

class RepositoryPaths {
  constructor(rootDirectory) {
    this.rootDirectory = rootDirectory;
  }

  adrDirectory() {
    return path.join(this.rootDirectory, "docs", "adr");
  }

  diagramsDirectory() {
    return path.join(this.rootDirectory, "docs", "diagrams");
  }

  toRelative(filePath) {
    return path.relative(this.rootDirectory, filePath).split(path.sep).join("/");
  }
}

class FileSystemClient {
  async listDirectory(directoryPath) {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));
  }

  async readText(filePath) {
    return fs.readFile(filePath, "utf8");
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

class AdrDocument {
  constructor(filePath, markdown) {
    this.filePath = filePath;
    this.markdown = markdown;
  }

  slug() {
    const baseName = path.basename(this.filePath, ".md");
    return baseName.toLowerCase();
  }

  diagramsSection() {
    const match = this.markdown.match(/## Diagrams([\s\S]*?)(\n## |\n# |$)/);
    if (!match) {
      return null;
    }
    return match[1].trim();
  }

  extractDiagramLinks() {
    const section = this.diagramsSection();
    if (!section) {
      return [];
    }
    const links = [];
    const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = pattern.exec(section)) !== null) {
      links.push({ label: match[1], target: match[2] });
    }
    return links;
  }
}

class AdrExplorer {
  constructor(pathService, fileSystem) {
    this.pathService = pathService;
    this.fileSystem = fileSystem;
  }

  async loadDocuments() {
    const documents = [];
    const entries = await this.fileSystem.listDirectory(this.pathService.adrDirectory());
    for (const entry of entries) {
      if (!entry.name.endsWith(".md")) {
        continue;
      }
      if (entry.name === "AGENTS.md" || entry.name.startsWith("_template")) {
        continue;
      }
      const absolutePath = path.join(this.pathService.adrDirectory(), entry.name);
      const markdown = await this.fileSystem.readText(absolutePath);
      documents.push(new AdrDocument(absolutePath, markdown));
    }
    return documents;
  }
}

class DiagramRequirement {
  constructor(type) {
    this.type = type;
  }

  matches(linkTarget, slug) {
    if (!linkTarget) {
      return false;
    }
    const normalized = linkTarget.toLowerCase();
    return normalized.includes(`/diagrams/${slug}/`) && normalized.includes(`${this.type}-`);
  }
}

class DiagramValidator {
  constructor(pathService, fileSystem) {
    this.pathService = pathService;
    this.fileSystem = fileSystem;
    this.requirements = [
      new DiagramRequirement("architecture"),
      new DiagramRequirement("data"),
      new DiagramRequirement("uml"),
      new DiagramRequirement("bpmn"),
    ];
    this.allowedExtensions = new Set([".md", ".mmd", ".puml", ".pu"]);
    this.diagramPatterns = [
      /```mermaid[\s\S]+?```/i,
      /```plantuml[\s\S]+?```/i,
      /@startuml[\s\S]+?@enduml/i,
    ];
  }

  async validateDocument(document, exemptions) {
    const slug = document.slug();
    if (exemptions.has(slug)) {
      return [];
    }
    const links = document.extractDiagramLinks();
    if (links.length === 0) {
      return [
        `${this.relative(document.filePath)}: missing ## Diagrams section with required links`,
      ];
    }
    const errors = [];
    for (const requirement of this.requirements) {
      const requirementErrors = await this.validateRequirement(requirement, document, links, slug);
      errors.push(...requirementErrors);
    }
    return errors;
  }

  async validateRequirement(requirement, document, links, slug) {
    const link = links.find((candidate) => requirement.matches(candidate.target, slug));
    if (!link) {
      return [
        `${this.relative(document.filePath)}: missing ${requirement.type} diagram link in ## Diagrams section`,
      ];
    }
    const diagramPath = this.resolveLink(document.filePath, link.target);
    if (!diagramPath) {
      return [
        `${this.relative(document.filePath)}: unable to resolve path for ${requirement.type} diagram link (${link.target})`,
      ];
    }
    const exists = await this.fileSystem.fileExists(diagramPath);
    if (!exists) {
      return [
        `${this.relative(document.filePath)}: linked ${requirement.type} diagram does not exist (${link.target})`,
      ];
    }
    if (!this.allowedExtensions.has(path.extname(diagramPath))) {
      return [
        `${this.relative(document.filePath)}: ${requirement.type} diagram must be a text-based source file (${link.target})`,
      ];
    }
    const content = await this.fileSystem.readText(diagramPath);
    if (!this.containsDiagramSyntax(content)) {
      return [
        `${this.relative(diagramPath)}: file must contain Mermaid or PlantUML markup for ${requirement.type} diagram`,
      ];
    }
    return [];
  }

  resolveLink(adDocPath, target) {
    if (!target) {
      return null;
    }
    if (target.startsWith("docs/")) {
      return path.join(this.pathService.rootDirectory, target);
    }
    if (target.startsWith("/")) {
      return null;
    }
    const adrDirectory = path.dirname(adDocPath);
    return path.resolve(adrDirectory, target);
  }

  containsDiagramSyntax(content) {
    return this.diagramPatterns.some((pattern) => pattern.test(content));
  }

  relative(filePath) {
    return this.pathService.toRelative(filePath);
  }
}

class LintRunner {
  constructor(validator, explorer, exemptions) {
    this.validator = validator;
    this.explorer = explorer;
    this.exemptions = exemptions;
  }

  async run() {
    const errors = [];
    const documents = await this.explorer.loadDocuments();
    for (const document of documents) {
      const documentErrors = await this.validator.validateDocument(document, this.exemptions);
      errors.push(...documentErrors);
    }
    if (errors.length > 0) {
      for (const message of errors) {
        console.error(message);
      }
      console.error(`\nDiagram lint failed with ${errors.length} error(s).`);
      process.exitCode = 1;
      return;
    }
    console.log(`Diagram lint passed for ${documents.length} ADR(s).`);
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const rootDirectory = path.resolve(path.dirname(__filename), "..");
  const paths = new RepositoryPaths(rootDirectory);
  const fileSystem = new FileSystemClient();
  const explorer = new AdrExplorer(paths, fileSystem);
  const validator = new DiagramValidator(paths, fileSystem);
  const runner = new LintRunner(validator, explorer, new Map());
  await runner.run();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
