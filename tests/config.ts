import { isArray, NOmit, Nullish } from 'core';
import { error, ReturnData } from 'core-promises';
import { FlatRD, FRD, TestPropsRD, ttestRD } from 'core-test';
import { DP } from '../src';

export function checkProperty(obj: Record<string, any>, property: string) {
  it(property, () => {
    expect(obj).toHaveProperty(property);
  });
}

export function checkProperties(
  obj: Record<string, any>,
  ...properties: string[]
) {
  properties.forEach(prop => checkProperty(obj, prop));
}

export function checkFileElement(requirePath: string, request: string) {
  it(`Element (${request}) shoulds exist in path : ${requirePath}`, () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(require(requirePath)).toHaveProperty(request);
  });
}

function compareS<T extends Nullish<string[] | string>>(
  arg1: T,
  arg2: DP<T>,
) {
  if (!arg2) return true;
  if (isArray(arg1)) {
    return arg1.length === arg2.length;
  }
  return arg1?.length > 0;
}

function _compareWrite<T extends string[] | string>(
  processed: ReturnData<T>,
  expected: FlatRD<T>,
) {
  return processed.maybeMap({
    else: error,
    success: (status, payload) => {
      const out =
        expected.status === status && compareS(payload, expected?.payload);

      return out;
    },
    information: (status, payload, messages) => {
      const out =
        expected.status === status &&
        compareS(payload, expected?.payload) &&
        compareS(messages, expected?.messages);

      return out;
    },
    redirect: (status, payload, messages) => {
      const out =
        expected.status === status &&
        compareS(payload, expected?.payload) &&
        compareS(messages, expected?.messages);
      return out;
    },
    client: (status, messages) => {
      const out =
        expected.status === status &&
        compareS(messages, expected?.messages);

      return out;
    },
    server: (status, messages) => {
      const out =
        expected.status === status &&
        compareS(messages, expected?.messages);

      return out;
    },
  });
}

export function testWrite<F extends FRD = FRD>({
  func,
  tests,
}: NOmit<TestPropsRD<F>, 'compare'>) {
  return ttestRD({ func, tests, compare: _compareWrite });
}
