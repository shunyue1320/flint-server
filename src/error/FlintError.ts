export class FlintError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FlintError";
    }
}
