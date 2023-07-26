export type ManifestId = string;

export type ManifestEntry = {
  file: string;
  isEntry?: boolean;
  imports?: ManifestId[];
};

export type Manifest = Record<ManifestId, ManifestEntry>;

export interface TagDescription {
  tag: string;
  props: Record<string, unknown>;
  id: string;
  name?: string;
  ref?: Element;
}

declare global {
  interface Env {
    /**
     * BE CAREFUL WHILE USING. AVAILABLE IN PRODUCTION ONLY.
     */
    manifest?: Manifest;
  }
}
