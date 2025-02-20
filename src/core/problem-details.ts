import { HttpStatus } from '@nestjs/common';

export type ProblemDetails = {
  title: string;
  details: string;
  statusCode: HttpStatus;
};
