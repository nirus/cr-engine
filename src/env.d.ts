// <reference types="astro/client" />
/// <reference types="@astrojs/image/client" />
declare var dataLayer: Array<any>

interface ImportMetaEnv {
  readonly GA_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
