export const cLog = import.meta.env.DEV ? console.log : () => {};
export const cWarn = import.meta.env.DEV ? console.warn : () => {}
