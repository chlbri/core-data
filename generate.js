/* eslint-disable @typescript-eslint/no-var-requires */
const {tuple, literal} =require('zod')

const LOGICAL_CLAUSES = tuple([
  literal('$and'),
  literal('$not'),
  literal('$or'),
  literal('$nor'),
]);

console.log('clauses', '=>', LOGICAL_CLAUSES.items);