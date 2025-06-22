// <reference types="astro/client" />
/// <reference types="@astrojs/image/client" />
declare let dataLayer: Array<Record<string, unknown>>

interface ImportMetaEnv {
  readonly GA_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
