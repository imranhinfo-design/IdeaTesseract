/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADS_TOP_ID: string
  readonly VITE_ADS_SIDEBAR_ID: string
  readonly VITE_ADS_FOOTER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
