import ora from 'ora';

export interface LoggerOps {
  debug?: boolean;
  prefix?: string;
}

export type Logger = ReturnType<typeof createLogger>;

export const createLogger = ({ debug, prefix }: LoggerOps) => {
  return {
    debug(...msg: unknown[]) {
      if (!debug) return;
      console.debug(...msg);
    },

    log(...msg: unknown[]) {
      console.log(...msg);
    },

    task({ name, total }: { name: string; total?: number }) {
      let tickCount = 0;
      const startTime = Date.now();
      let currentTotal = total;
      const logger = ora({ prefixText: prefix, text: `Starting ${name}...` }).start();

      return {
        set total(val: number) {
          currentTotal = val;
        },

        tick(current?: number) {
          tickCount = current !== void 0 ? current : tickCount + 1;
          logger.text = `Processing ${name} [${tickCount} / ${currentTotal}]`;
        },

        succeed(msg?: string) {
          const successMsg = msg || ['Finished', currentTotal, name].filter(Boolean).join(' ');
          const timeTake = Date.now() - startTime;
          logger.succeed(`${successMsg} [${timeTake}ms]`);
        },

        warn(msg: string) {
          logger.warn(`Problem while ${name}: ${msg}`);
        },

        fail(msg: string) {
          logger.fail(`Error while ${name}: ${msg}`);
        },
      };
    },
  };
};

export const logTask = async (logger: Logger, taskFn: () => Promise<unknown>, { name }: { name: string }) => {
  const p = logger.task({ name });
  try {
    await taskFn();

    p.succeed();
  } catch (e) {
    p.fail(String(e));
    throw e;
  }
};
