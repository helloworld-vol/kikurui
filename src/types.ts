import { ZodType } from "zod";

export type toZod<T extends Record<string, any>> = {
  [K in keyof T]-?: ZodType<T[K]>;
};
