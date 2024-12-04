export class MockError extends Error {
  code: number;
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name; // Error name will be the class name ("CustomError")
    this.code = code; // Custom code property
    this.stack = new Error().stack; // Capture the stack trace
  }
}
