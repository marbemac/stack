const voidEmpty = (value: string) => (!!value ? value : undefined);

export const cn = (...classes: (string | boolean | null | undefined)[]) =>
  voidEmpty(classes.flat(Infinity).filter(Boolean).join(" "));
