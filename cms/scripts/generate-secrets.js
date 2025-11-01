const crypto = require("node:crypto");

class SecretGenerator {
  constructor(length) {
    this.length = length;
  }

  create() {
    return crypto.randomBytes(this.length).toString("base64url");
  }
}

class StrapiSecretSetBuilder {
  constructor(secretGenerator) {
    this.secretGenerator = secretGenerator;
  }

  build() {
    return {
      APP_KEYS: this.joinSecrets(4),
      ADMIN_JWT_SECRET: this.secretGenerator.create(),
      API_TOKEN_SALT: this.secretGenerator.create(),
      TRANSFER_TOKEN_SALT: this.secretGenerator.create(),
      JWT_SECRET: this.secretGenerator.create(),
      ENCRYPTION_KEY: this.secretGenerator.create(),
    };
  }

  joinSecrets(count) {
    return Array.from({ length: count }, () => this.secretGenerator.create()).join(
      ",",
    );
  }
}

class SecretsPresenter {
  constructor(strapiSecretSetBuilder) {
    this.strapiSecretSetBuilder = strapiSecretSetBuilder;
  }

  print() {
    const secrets = this.strapiSecretSetBuilder.build();

    // eslint-disable-next-line no-console -- CLI helper intended for terminal usage
    console.log("Generated Strapi secrets:\n");
    Object.entries(secrets).forEach(([key, value]) => {
      // eslint-disable-next-line no-console -- CLI helper intended for terminal usage
      console.log(`${key}=${value}`);
    });
  }
}

(() => {
  const generator = new SecretGenerator(32);
  const secretBuilder = new StrapiSecretSetBuilder(generator);
  const presenter = new SecretsPresenter(secretBuilder);

  presenter.print();
})();
