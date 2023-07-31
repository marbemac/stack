import { type StyleProps, stylePropsResolver } from '@marbemac/ui-styles';
import { createContext, useContext } from 'react';

type PrimitivesConfig = {
  stylePropResolver: (props: StyleProps) => string | void;
};

export const PrimitivesContext = createContext<PrimitivesConfig | null>(null);

type PrimitivesProviderOpts = Partial<PrimitivesConfig> & {
  children: React.ReactNode;
};

export const PrimitivesProvider = ({ children, ...opts }: PrimitivesProviderOpts) => {
  return (
    <PrimitivesContext.Provider
      value={{
        stylePropResolver: opts.stylePropResolver || stylePropsResolver,
      }}
    >
      {children}
    </PrimitivesContext.Provider>
  );
};

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
