export interface StrapiEnv {
  (key: string, defaultValue?: string): string;
  bool(key: string, defaultValue?: boolean): boolean;
  int(key: string, defaultValue?: number): number;
  array(key: string, defaultValue?: string[]): string[];
}

export interface ConfigContext {
  env: StrapiEnv;
}
