import { Injectable, PipeTransform } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { isValidObjectId } from 'mongoose';

/** Rejects arguments that are not valid MongoDB ObjectIds with a clear GraphQL error. */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new GraphQLError(`"${value}" is not a valid id.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    return value;
  }
}
