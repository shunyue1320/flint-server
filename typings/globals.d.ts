declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production";
    }
}

declare module "*.eta" {
    const a: string;
    export default a;
}
