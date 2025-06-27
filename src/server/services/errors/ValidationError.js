import { CustomError } from "./CustomError.js";

export class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}
