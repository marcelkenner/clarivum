import Ajv from "ajv";
import addFormats from "ajv-formats";
import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbListStructuredData,
  buildItemListStructuredData,
  buildWebPageStructuredData,
} from "../structured-data";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const webPageSchema = {
  type: "object",
  required: ["@context", "@type", "name", "description", "url", "publisher", "inLanguage"],
  properties: {
    "@context": { type: "string", const: "https://schema.org" },
    "@type": { type: "string", const: "WebPage" },
    name: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    url: { type: "string", format: "uri" },
    inLanguage: { type: "string", minLength: 2 },
    publisher: {
      type: "object",
      required: ["@type", "name", "url"],
      properties: {
        "@type": { type: "string", const: "Organization" },
        name: { type: "string" },
        url: { type: "string", format: "uri" },
        logo: { type: "object" },
      },
    },
  },
  additionalProperties: true,
} as const;

const breadcrumbSchema = {
  type: "object",
  required: ["@context", "@type", "@id", "itemListElement"],
  properties: {
    "@context": { type: "string", const: "https://schema.org" },
    "@type": { type: "string", const: "BreadcrumbList" },
    "@id": { type: "string" },
    itemListElement: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["@type", "position", "name", "item"],
        properties: {
          "@type": { type: "string", const: "ListItem" },
          position: { type: "integer", minimum: 1 },
          name: { type: "string" },
          item: { type: "string", format: "uri" },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
} as const;

const itemListSchema = {
  type: "object",
  required: ["@context", "@type", "name", "itemListElement"],
  properties: {
    "@context": { type: "string", const: "https://schema.org" },
    "@type": { type: "string", const: "ItemList" },
    name: { type: "string" },
    description: { type: "string" },
    url: { type: "string", format: "uri" },
    itemListElement: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["@type", "position", "name", "item"],
        properties: {
          "@type": { type: "string", const: "ListItem" },
          position: { type: "integer", minimum: 1 },
          name: { type: "string" },
          item: { type: "string", format: "uri" },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
} as const;

describe("structured data builders", () => {
  it("creates valid WebPage JSON-LD payloads", () => {
    const payload = buildWebPageStructuredData({
      name: "Clarivum test page",
      description: "Opis testowy strony Clarivum.",
      url: "https://clarivum.com/test",
      breadcrumbId: "https://clarivum.com/test#breadcrumb",
      potentialActions: [{ name: "Odwiedź Skin", target: "https://clarivum.com/skin" }],
    });

    const result = ajv.validate(webPageSchema, payload);
    expect(result).toBe(true);
    expect(ajv.errors ?? null).toBeNull();
  });

  it("creates valid BreadcrumbList JSON-LD payloads", () => {
    const payload = buildBreadcrumbListStructuredData({
      id: "https://clarivum.com/test#breadcrumb",
      items: [
        { name: "Clarivum", url: "https://clarivum.com/" },
        { name: "Test", url: "https://clarivum.com/test" },
      ],
    });

    const result = ajv.validate(breadcrumbSchema, payload);
    expect(result).toBe(true);
    expect(ajv.errors ?? null).toBeNull();
  });

  it("creates valid ItemList JSON-LD payloads", () => {
    const payload = buildItemListStructuredData({
      name: "Clarivum kroki",
      description: "Najważniejsze kroki planu Clarivum.",
      url: "https://clarivum.com/test",
      items: [
        { name: "Skin start", url: "https://clarivum.com/skin", position: 1 },
        { name: "Fuel start", url: "https://clarivum.com/fuel", position: 2 },
      ],
    });

    const result = ajv.validate(itemListSchema, payload);
    expect(result).toBe(true);
    expect(ajv.errors ?? null).toBeNull();
  });
});
