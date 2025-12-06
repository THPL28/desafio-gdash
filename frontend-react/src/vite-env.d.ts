// vite-env.d.ts 

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // ... outras VITE_ variaveis
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}