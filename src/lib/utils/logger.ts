import chalk from 'chalk';

const isBrowser = typeof window !== 'undefined';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const emojis: Record<LogLevel, string> = {
  log:   '📗',
  info:  'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🐛',
};

const styles = {
  log: { chalk: chalk.bgGreen.black, css: 'background-color: green; color: black' },
  info: { chalk: chalk.bgBlue.white, css: 'background-color: blue; color: white' },
  warn: { chalk: chalk.bgYellow.black, css: 'background-color: orange; color: black' },
  error: { chalk: chalk.bgRed.white.bold, css: 'background-color: red; color: white; font-weight: bold' },
  debug: { chalk: chalk.bgGray.white, css: 'background-color: gray; color: white' },
} satisfies Record<LogLevel, { chalk: (str: string) => string; css: string }>;


const shouldLog = (level: LogLevel) =>
  level === 'error' || import.meta.env.DEV;

function log(level: LogLevel, ...args: unknown[]) {
  if (!shouldLog(level)) return;

  const { chalk: chalkStyle, css } = styles[level];
  const prefix = `${emojis[level]} [${level.toUpperCase()}]`;

  if (isBrowser) {
    console[level](`%c${prefix}`, css, ...args);
  } else {
    console[level](chalkStyle(prefix), ...args);
  }
}

export const logger = {
  log: (...args: unknown[]) => log('log', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
  debug: (...args: unknown[]) => log('debug', ...args),
};
