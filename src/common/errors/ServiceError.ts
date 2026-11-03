export class ServiceError extends Error {
  readonly errorType: string;

  constructor(error: string, message: string) {
    super(message);
    this.errorType = error;
  }
}