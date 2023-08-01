import type { StyleProps, StylePropsResolver } from '@marbemac/ui-styles';
import { stylePropsResolver as defaultStylePropResolver } from '@marbemac/ui-styles';
import { createContext, useContext } from 'react';

import type { ThemeProviderProps } from './components/Themed/types.ts';
import { Themed } from './index.ts';
import { polyRef } from './utils/forward-ref.ts';

type PrimitivesConfig = {
  stylePropResolver: StylePropsResolver;
};

export const PrimitivesContext = createContext<PrimitivesConfig | null>(null);

type PrimitivesProviderProps = Partial<PrimitivesConfig> & ThemeProviderProps;

export const PrimitivesProvider = polyRef<'div', PrimitivesProviderProps>(({ stylePropResolver, ...others }, ref) => {
  return (
    <PrimitivesContext.Provider
      value={{
        stylePropResolver: stylePropResolver || defaultStylePropResolver,
      }}
    >
      <Themed ref={ref} {...others} />
    </PrimitivesContext.Provider>
  );
});

const usePrimitives = () => {
  const config = useContext(PrimitivesContext);
  if (!config) {
    throw new Error('`usePrimitives` must be used within a `PrimitivesProvider`');
  }

  return config;
};

export const useStyleProps = (props: StyleProps) => {
  return usePrimitives().stylePropResolver(props);
};
