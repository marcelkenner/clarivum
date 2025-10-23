import { Environment } from "./Environment";

import type { ClarivumEnvironmentName } from "./Environment";

const CLARIVUM_ENVIRONMENT_KEY = "CLARIVUM_ENVIRONMENT";
const NEXT_PUBLIC_CLARIVUM_ENVIRONMENT_KEY = "NEXT_PUBLIC_CLARIVUM_ENVIRONMENT";
const DEFAULT_ENVIRONMENT: ClarivumEnvironmentName = "dev";

/**
 * Resolves the active deployment environment from process variables.
 */
export class EnvironmentManager {
  private cachedEnvironment: Environment | null = null;

  constructor(private readonly variables: NodeJS.ProcessEnv) {}

  public getEnvironment(): Environment {
    if (this.cachedEnvironment) {
      return this.cachedEnvironment;
    }

    const environment = this.createEnvironment();
    this.cachedEnvironment = environment;
    return environment;
  }

  public clearCache(): void {
    this.cachedEnvironment = null;
  }

  private createEnvironment(): Environment {
    const rawName = this.resolveEnvironmentName();
    const normalizedName = this.normalizeName(rawName);

    return new Environment(normalizedName);
  }

  private resolveEnvironmentName(): string {
    const explicitEnvironment =
      this.variables[CLARIVUM_ENVIRONMENT_KEY] ??
      this.variables[NEXT_PUBLIC_CLARIVUM_ENVIRONMENT_KEY];

    if (explicitEnvironment) {
      return explicitEnvironment;
    }

    const derivedFromNode = this.mapNodeEnvironment(this.variables.NODE_ENV);
    if (derivedFromNode) {
      return derivedFromNode;
    }

    return DEFAULT_ENVIRONMENT;
  }

  private mapNodeEnvironment(
    nodeEnvironment: string | undefined,
  ): ClarivumEnvironmentName | undefined {
    if (!nodeEnvironment) {
      return undefined;
    }

    const normalized = nodeEnvironment.trim().toLowerCase();

    if (normalized === "production") {
      return "prod";
    }

    if (normalized === "development" || normalized === "test") {
      return "dev";
    }

    return undefined;
  }

  private normalizeName(input: string): ClarivumEnvironmentName {
    const normalized = input.trim().toLowerCase();

    if (normalized === "dev" || normalized === "development") {
      return "dev";
    }

    if (normalized === "prod" || normalized === "production") {
      return "prod";
    }

    throw new Error(`Unsupported Clarivum environment "${input}". Use "dev" or "prod".`);
  }
}
