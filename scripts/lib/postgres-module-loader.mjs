import process from "node:process";

const DEFAULT_LABEL = "pg-loader";

export class PgModuleMissingError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = "PgModuleMissingError";
  }
}

export async function loadPgModule({
  label = DEFAULT_LABEL,
  moduleLoader,
} = {}) {
  const loader = typeof moduleLoader === "function" ? moduleLoader : () => import("pg");
  try {
    return await loader();
  } catch (error) {
    if (isModuleNotFoundError(error)) {
      const guidanceMessage = buildGuidanceMessage(label);
      throw new PgModuleMissingError(guidanceMessage, { cause: error });
    }
    throw error;
  }
}

function isModuleNotFoundError(error) {
  if (!error) {
    return false;
  }
  if (error.code === "ERR_MODULE_NOT_FOUND") {
    return true;
  }
  if (typeof error.message === "string") {
    return error.message.includes("Cannot find package 'pg'");
  }
  return false;
}

function buildGuidanceMessage(label) {
  const prefix = label ? `[${label}]` : "[pg-loader]";
  const steps = [
    `${prefix} Required dependency 'pg' is not installed.`,
    "Run 'source ~/.nvm/nvm.sh && nvm use --silent && npm install' from the repository root, then retry the command.",
    "Refer to docs/runbooks/zero-downtime-migrations.md for migration prerequisites.",
  ];

  if (process.platform === "win32") {
    steps.splice(
      1,
      0,
      "If you are on Windows PowerShell, use 'wsl' or the Git Bash environment to source nvm before running npm scripts.",
    );
  }

  return steps.join("\n");
}
