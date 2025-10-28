type JsonLdProps = {
  id?: string;
  data: Record<string, unknown>;
};

export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      {...(id ? { id } : {})}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
