declare module "@strapi/strapi/admin" {
  export interface StrapiApp {
    registerPlugin(plugin: unknown): void;
    registerHook(name: string, handler: (...args: unknown[]) => void): void;
    getPlugin<T = unknown>(name: string): T | undefined;
    getPluginId?(plugin: unknown): string | undefined;
  }
}
