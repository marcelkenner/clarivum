import type { ConfigContext, StrapiEnv } from "./types";

type UploadProviderConfig = {
  config: {
    provider: string;
    providerOptions: {
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      };
      params: {
        Bucket: string;
      };
      region: string;
      baseUrl?: string;
      s3ForcePathStyle?: boolean;
      signatureVersion?: string;
      endpoint?: string;
    };
    actionOptions: Record<string, unknown>;
  };
};

class UploadPluginConfiguration {
  constructor(private readonly env: StrapiEnv) {}

  private get bucket(): string {
    return this.env("STRAPI_UPLOAD_S3_BUCKET", "");
  }

  private get region(): string {
    return this.env("STRAPI_UPLOAD_S3_REGION", "");
  }

  private get accessKeyId(): string {
    return this.env("STRAPI_UPLOAD_S3_ACCESS_KEY_ID", "");
  }

  private get secretAccessKey(): string {
    return this.env("STRAPI_UPLOAD_S3_SECRET_ACCESS_KEY", "");
  }

  private get optionalEndpoint(): string | undefined {
    const endpoint = this.env("STRAPI_UPLOAD_S3_ENDPOINT", "");
    return endpoint.length > 0 ? endpoint : undefined;
  }

  private get optionalBaseUrl(): string | undefined {
    const baseUrl = this.env("STRAPI_UPLOAD_S3_BASE_URL", "");
    return baseUrl.length > 0 ? baseUrl : undefined;
  }

  private buildProviderOptions() {
    const options: UploadProviderConfig["config"]["providerOptions"] = {
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      params: {
        Bucket: this.bucket,
      },
      region: this.region,
    };

    const endpoint = this.optionalEndpoint;
    if (endpoint) {
      options.endpoint = endpoint;
      options.s3ForcePathStyle = this.env.bool("STRAPI_UPLOAD_S3_FORCE_PATH_STYLE", false);
      options.signatureVersion = this.env("STRAPI_UPLOAD_S3_SIGNATURE_VERSION", "") || undefined;
    }
    const baseUrl = this.optionalBaseUrl;
    if (baseUrl) {
      options.baseUrl = baseUrl;
    }

    return options;
  }

  build(): UploadProviderConfig | undefined {
    if (!this.bucket || !this.region || !this.accessKeyId || !this.secretAccessKey) {
      return undefined;
    }

    return {
      config: {
        provider: "aws-s3",
        providerOptions: this.buildProviderOptions(),
        actionOptions: {},
      },
    };
  }
}

const pluginConfig = ({ env }: ConfigContext) => {
  const uploadConfiguration = new UploadPluginConfiguration(env).build();

  return {
    ...(uploadConfiguration ? { upload: uploadConfiguration } : {}),
  };
};

export default pluginConfig;
