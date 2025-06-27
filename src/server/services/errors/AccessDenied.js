import { CustomError } from "./CustomError.js";

export class AccessDenied extends CustomError {
  constructor(message) {
    super(message, 403);
  }
}
