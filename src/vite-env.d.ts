/// <reference types="vite/client" />

import type { OilSceneDiagnostics } from "@/three/oilScene";

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    __BOOK_SCENE_DIAGNOSTICS__?: OilSceneDiagnostics;
  }
}

export {};
