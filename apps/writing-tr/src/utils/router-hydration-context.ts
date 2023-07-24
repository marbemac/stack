import type { DehydratedRouter } from '@tanstack/router';
import { createContext } from 'react';

export const RouterHydrationContext = createContext<{ router?: DehydratedRouter; payload?: unknown }>({});
