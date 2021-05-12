import { CustomError } from "./custom-error";

export class DatabaseError extends CustomError {
  statusCode = 500;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
