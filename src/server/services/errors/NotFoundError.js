import { CustomError } from "./CustomError.js";

export class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}
