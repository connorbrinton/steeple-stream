declare global {
  interface Error {
    status?: number;
    retryAfter?: number;
  }
}

export {};
