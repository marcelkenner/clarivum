export type Awaitable<TValue> = TValue | Promise<TValue>;

/**
 * Normalises Next.js App Router route params which may be eagerly provided
 * or wrapped in a Promise depending on the framework version and compilation mode.
 */
export class PageParamsResolver<TParams> {
  private constructor(private readonly params: Awaitable<TParams>) {}

  static from<TParams>(params: Awaitable<TParams>): PageParamsResolver<TParams> {
    return new PageParamsResolver<TParams>(params);
  }

  async resolve(): Promise<TParams> {
    return await this.params;
  }
}
