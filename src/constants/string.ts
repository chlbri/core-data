import { getLiteralValues } from '../function/zod';
import { errorSchema } from '../schemas/error';

export const ERRORS_STRING = getLiteralValues(errorSchema);
