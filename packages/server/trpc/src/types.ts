import type {
  CreateRouterInner,
  DefaultErrorShape,
  ProcedureBuilder,
  ProcedureRouterRecord,
  RootConfig,
} from '@trpc/server';
import type SuperJSON from 'superjson';

type CRootConfig<C extends object> = RootConfig<{
  ctx: C;
  meta: object;
  errorShape: DefaultErrorShape;
  transformer: typeof SuperJSON;
}>;

type Procedure<C extends object> = ProcedureBuilder<{
  _config: CRootConfig<C>;
  _ctx_out: C;
  _input_in: any;
  _input_out: any;
  _output_in: any;
  _output_out: any;
  _meta: any;
}>;

export interface BaseRouterOpts<C extends object> {
  router: <TProcRouterRecord extends ProcedureRouterRecord>(
    p: TProcRouterRecord,
  ) => CreateRouterInner<CRootConfig<C>, TProcRouterRecord>;
  publicProcedure: Procedure<C>;
}
