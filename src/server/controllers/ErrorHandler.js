import { CustomError } from "../services/errors/CustomError.js";

function handleError(error) {
  const unexpectedError = {
    status: 500,
    message: "Sorry, something unexpected happened",
  };

  console.log(error);

  if (error instanceof CustomError) {
    return error;
  }

  return unexpectedError;
}

export default handleError;
