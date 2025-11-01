import { describe, expect, it } from "vitest";

describe("loadSecretsManagerModule", () => {
  it("returns the loaded module when the import succeeds", async () => {
    const { loadSecretsManagerModule } = await import(
      "../../scripts/lib/secrets-manager-module-loader.mjs"
    );

    const fakeModule = {
      SecretsManagerClient: class {},
      GetSecretValueCommand: class {},
    };

    const module = await loadSecretsManagerModule({
      label: "unit-test",
      moduleLoader: async () => fakeModule,
    });

    expect(module).toBe(fakeModule);
  });

  it("wraps module-not-found errors with actionable guidance", async () => {
    const {
      loadSecretsManagerModule,
      AwsSecretsManagerModuleMissingError,
    } = await import("../../scripts/lib/secrets-manager-module-loader.mjs");

    const missingModuleError = new Error(
      "Cannot find package '@aws-sdk/client-secrets-manager'",
    );
    // @ts-expect-error – `code` is a Node.js-specific field we attach manually for the test.
    missingModuleError.code = "ERR_MODULE_NOT_FOUND";

    const loaderPromise = loadSecretsManagerModule({
      label: "unit-test",
      moduleLoader: async () => {
        throw missingModuleError;
      },
    });

    await expect(loaderPromise).rejects.toBeInstanceOf(
      AwsSecretsManagerModuleMissingError,
    );

    await loaderPromise.catch((error) => {
      expect(error).toBeInstanceOf(AwsSecretsManagerModuleMissingError);
      expect(error).toMatchObject({
        cause: missingModuleError,
        message: expect.stringContaining(
          "source ~/.nvm/nvm.sh && nvm use --silent && npm install",
        ),
      });
      return null;
    });
  });
});
