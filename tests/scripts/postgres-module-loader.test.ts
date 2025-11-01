import { describe, expect, it } from "vitest";

describe("loadPgModule", () => {
  it("returns the loaded module when the import succeeds", async () => {
    const { loadPgModule } = await import("../../scripts/lib/postgres-module-loader.mjs");
    const fakeModule = { Client: class {} };

    const module = await loadPgModule({
      label: "unit-test",
      moduleLoader: async () => fakeModule,
    });

    expect(module).toBe(fakeModule);
  });

  it("wraps module-not-found errors with actionable guidance", async () => {
    const { loadPgModule, PgModuleMissingError } = await import(
      "../../scripts/lib/postgres-module-loader.mjs"
    );

    const missingModuleError = new Error("Cannot find package 'pg'");
    // @ts-expect-error – `code` is a Node.js-specific field we attach manually for the test.
    missingModuleError.code = "ERR_MODULE_NOT_FOUND";

    const loaderPromise = loadPgModule({
      label: "unit-test",
      moduleLoader: async () => {
        throw missingModuleError;
      },
    });

    await expect(loaderPromise).rejects.toBeInstanceOf(PgModuleMissingError);

    await loaderPromise.catch((error) => {
      expect(error).toBeInstanceOf(PgModuleMissingError);
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
