export * from './dso';
export * from './permission';
export * from './repo';

export type NOmit<T, K extends keyof T> = Omit<Text, K>;
