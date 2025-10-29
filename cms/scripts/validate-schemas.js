#!/usr/bin/env node

/**
 * Validates Strapi content-type and component schemas.
 *
 * The checks mirror the structure documented in the Strapi schema reference:
 * https://docs.strapi.io/dev-docs/api/content-types
 */

const fs = require("node:fs");
const path = require("node:path");

const cmsRoot = process.cwd();
const contentTypesDir = path.join(cmsRoot, "src", "api");
const componentsDir = path.join(cmsRoot, "src", "components");

const issues = [];

const contentTypeSchemas = collectSchemas(contentTypesDir, "schema.json");
const componentSchemas = collectSchemas(componentsDir, "component.json");

if (contentTypeSchemas.length === 0 && componentSchemas.length === 0) {
  console.log(
    "No Strapi schemas found (create content types or components to enforce validation).",
  );
  process.exit(0);
}

for (const schemaPath of contentTypeSchemas) {
  const schema = readJson(schemaPath);
  if (!schema) {
    continue;
  }
  validateContentTypeSchema(schemaPath, schema);
}

for (const schemaPath of componentSchemas) {
  const schema = readJson(schemaPath);
  if (!schema) {
    continue;
  }
  validateComponentSchema(schemaPath, schema);
}

if (issues.length > 0) {
  console.error("\nSchema validation failed:");
  for (const issue of issues) {
    console.error(`- ${issue.path}: ${issue.message}`);
  }
  process.exit(1);
}

console.log("All Strapi schemas passed validation.");
process.exit(0);

function collectSchemas(baseDir, fileName) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  const results = [];
  walk(baseDir, (entryPath) => {
    if (path.basename(entryPath) === fileName) {
      results.push(entryPath);
    }
  });
  return results;
}

function walk(currentPath, onMatch) {
  const stat = fs.statSync(currentPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(currentPath)) {
      walk(path.join(currentPath, entry), onMatch);
    }
    return;
  }
  onMatch(currentPath);
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    issues.push({
      path: relative(filePath),
      message: `Failed to parse JSON (${error.message})`,
    });
    return null;
  }
}

function validateContentTypeSchema(filePath, schema) {
  const rel = relative(filePath);
  const validKinds = new Set(["collectionType", "singleType"]);
  if (!validKinds.has(schema.kind)) {
    issues.push({ path: rel, message: `kind must be one of ${[...validKinds].join(", ")}.` });
  }
  if (typeof schema.collectionName !== "string" || schema.collectionName.trim().length === 0) {
    issues.push({ path: rel, message: "collectionName must be a non-empty string." });
  }
  if (!schema.info || typeof schema.info !== "object") {
    issues.push({ path: rel, message: "info block is required." });
  } else {
    if (
      typeof schema.info.displayName !== "string" ||
      schema.info.displayName.trim().length === 0
    ) {
      issues.push({ path: rel, message: "info.displayName must be a non-empty string." });
    }
  }
  validateAttributes(rel, schema.attributes);
}

function validateComponentSchema(filePath, schema) {
  const rel = relative(filePath);
  if (typeof schema.collectionName !== "string" || schema.collectionName.trim().length === 0) {
    issues.push({ path: rel, message: "collectionName must be a non-empty string." });
  }
  if (!schema.info || typeof schema.info !== "object") {
    issues.push({ path: rel, message: "info block is required." });
  } else if (
    typeof schema.info.displayName !== "string" ||
    schema.info.displayName.trim().length === 0
  ) {
    issues.push({ path: rel, message: "info.displayName must be a non-empty string." });
  }
  validateAttributes(rel, schema.attributes);
}

function validateAttributes(relPath, attributes) {
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) {
    issues.push({
      path: relPath,
      message: "attributes must be an object mapping field names to definitions.",
    });
    return;
  }

  for (const [name, definition] of Object.entries(attributes)) {
    if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
      issues.push({ path: relPath, message: `Attribute ${name} must be an object.` });
      continue;
    }
    if (typeof definition.type !== "string" || definition.type.trim().length === 0) {
      issues.push({ path: relPath, message: `Attribute ${name} missing type.` });
    }
  }
}

function relative(filePath) {
  return path.relative(cmsRoot, filePath) || filePath;
}
