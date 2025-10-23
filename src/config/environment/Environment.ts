export type ClarivumEnvironmentName = "dev" | "prod";

/**
 * Represents a concrete Clarivum deployment environment.
 */
export class Environment {
  constructor(private readonly environmentName: ClarivumEnvironmentName) {}

  public get name(): ClarivumEnvironmentName {
    return this.environmentName;
  }

  public isDev(): boolean {
    return this.environmentName === "dev";
  }

  public isProd(): boolean {
    return this.environmentName === "prod";
  }
}
