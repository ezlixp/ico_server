import { BadRequestException, Controller, HttpStatus } from '@nestjs/common';
import { Result } from './result';
import { ProblemDetails } from './problem-details';

@Controller()
export abstract class AppController {
  protected handleFailure(result: Result) {
    if (result.isSuccess) {
      throw Error("You cannot handle a successful result's failure.");
    }

    return this.handleBadRequest(result);
  }

  private handleBadRequest(result: Result) {
    const problemDetails = this.createProblemDetails(
      'Bad Request',
      result.error.errorMessage,
      HttpStatus.BAD_REQUEST,
    );
    throw new BadRequestException(problemDetails);
  }

  private createProblemDetails(
    title: string,
    details: string,
    statusCode: HttpStatus,
  ): ProblemDetails {
    return {
      title,
      details,
      statusCode,
    };
  }
}
