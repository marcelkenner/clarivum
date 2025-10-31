import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "aws-lambda-streaming",
      converter: "aws-apigw-v2",
      incrementalCache: "s3",
      tagCache: "dynamodb",
    },
    minify: true,
  },
};

export default config;
