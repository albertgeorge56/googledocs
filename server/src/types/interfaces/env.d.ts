declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    HOST?: string;
    PORT?: string;
    DB_URL?: string;
    USER?: string;
    PASSWORD?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DATABASE?: string;
  }
}
