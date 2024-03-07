export const cssObjToString = (json: Record<string, Record<string, unknown>>) => {
  const selectors = Object.keys(json);
  return selectors
    .map(selector => {
      const definition = json[selector]!;

      return `${selector}{${cssPropsToString(definition)}}`;
    })
    .join('\n');
};

export const cssPropsToString = (props: Record<string, unknown>, format?: boolean) => {
  const rules = Object.keys(props);
  return rules
    .map(rule => {
      return `${rule}: ${props[rule]}`;
    })
    .join(`;${format ? '\n' : ''}`);
};
