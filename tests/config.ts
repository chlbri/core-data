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
