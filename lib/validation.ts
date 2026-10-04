import { z } from "zod";

/** Honeypot: real users never fill this hidden field; bots usually do. */
const honeypot = z.string().max(200).optional();

export const contactSchema = z.object({
  name:    z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email:   z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const hireSchema = z.object({
  name:         z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email:        z.string().trim().email("Please enter a valid email").max(255),
  company:      z.string().trim().max(200).optional(),
  project_type: z.string().trim().min(1, "Please select a project type").max(100),
  budget:       z.string().trim().min(1, "Please select a budget range").max(50),
  timeline:     z.string().trim().max(100).optional(),
  message:      z.string().trim().min(20, "Message must be at least 20 characters").max(3000),
  website:      honeypot,
});
export type HireInput = z.infer<typeof hireSchema>;

/** Optional http(s) URL used by admin forms (empty string allowed). */
export const optionalHttpUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Must be a valid http(s) URL")
  .optional();
