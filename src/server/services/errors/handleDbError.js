import mongoose from "mongoose";
import { ValidationError } from "./ValidationError.js";

export function handleDbError(error) {
  if (error.code === 11000) {
    // Duplicated key error
    throw new ValidationError("Duplicated key error");
  } else if (error instanceof mongoose.Error.ValidationError) {
    const missingFields = Object.values(error.errors)
      .filter((e) => e.kind === "required")
      .map((e) => e.path);
    throw new ValidationError(
      `The following required attributes are missing: ${missingFields.join(", ")}`
    );
  }

  throw error;
}
