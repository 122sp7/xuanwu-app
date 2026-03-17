// SuperJSON wrapper
// Install: npm install superjson

// export { default as superjson } from "superjson";

export function serialize(data: unknown): string {
  return JSON.stringify(data);
}

export function deserialize<T>(data: string): T {
  return JSON.parse(data) as T;
}
