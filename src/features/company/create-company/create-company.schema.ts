import z from "zod";
import { RESERVED_SLUGS, slugPattern } from "../shared/utils/slug";
import { CompanySize } from "../shared/types";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be 100 characters or less")
    .trim(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be 100 characters or less")
    .trim()
    .refine((val) => slugPattern.test(val), {
      message:
        "Slug must be lowercase, alphanumeric, and may contain hyphens (not at start or end)",
    })
    .refine((val) => !RESERVED_SLUGS.includes(val.toLowerCase()), {
      message: "This slug is reserved and cannot be used",
    }),

  size: z.enum([
    "STARTUP_1_10",
    "SMALL_11_50",
    "MEDIUM_51_200",
    "LARGE_201_1000",
    "ENTERPRISE_1000_PLUS",
  ]),

  website: z
    .url("Please enter a valid URL starting with http or https")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CreateCompanyFormType = z.infer<typeof createCompanySchema>;

export const createCompanyDefaultValues: CreateCompanyFormType = {
  name: "",
  slug: "",
  size: CompanySize.SMALL_11_50,
  website: "",
};
