export class ApiError extends Error {
    readonly code: number | string;
    readonly status: number;

    // Constructor accepts code, message, and status
    constructor(code: number | string, message: string, status: number = 200) {
        // Call the parent constructor (Error) to set the message
        super(message);
        
        // Set the prototype explicitly (necessary in TypeScript for custom errors)
        Object.setPrototypeOf(this, ApiError.prototype);
        
        // Initialize custom properties
        this.code = code;
        this.status = status;
        
        // Optional: You can set the name property to indicate it's a custom error
        this.name = this.constructor.name;
    }
}
