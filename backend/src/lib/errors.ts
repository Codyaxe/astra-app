export class NotImplementedError extends Error {
  public statusCode: number;

  constructor(message = 'Feature not implemented yet') {
    super(message);
    this.name = 'NotImplementedError';
    this.statusCode = 501;
  }
}
