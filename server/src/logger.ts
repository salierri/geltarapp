export const info = (text: string) => {
  console.log(`${(new Date()).toISOString()}\t${text}`);
};

export const error = (text: string) => {
  console.log(`\x1b[31m${(new Date()).toISOString()}\t${text}\x1b[0m`);
};

export const warn = (text: string) => {
  console.log(`\x1b[33m${(new Date()).toISOString()}\t${text}\x1b[0m`);
};
