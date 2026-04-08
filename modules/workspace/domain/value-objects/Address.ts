import { z } from "@lib-zod";

export const AddressSchema = z
  .object({
    street: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim(),
    postalCode: z.string().trim(),
    country: z.string().trim(),
    details: z.string().trim().optional(),
  })
  .brand<"Address">();

export type Address = z.infer<typeof AddressSchema>;
export type AddressInput = z.input<typeof AddressSchema>;

export function createAddress(value: AddressInput): Address {
  const parsed = AddressSchema.parse(value);
  return Object.freeze({ ...parsed }) as Address;
}

export function formatAddress(address: Address): string[] {
  return [
    address.street,
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country,
    address.details,
  ].filter((line): line is string => Boolean(line));
}