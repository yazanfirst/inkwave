export const money = (n: number) => Number(n.toFixed(2));
export const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
