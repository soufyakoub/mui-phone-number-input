import { data } from "./data";

export * from "./data";
export type CountryCode = keyof typeof data;
export const countryCodes = Object.keys(data) as CountryCode[];
