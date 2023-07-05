export declare function acquireVsCodeApi(): unknown | never;

declare global {
  interface Window {
    cefQuery: (query: { request: string }) => void;
  }

  interface File {
    path: string;
  }
}

export {};
