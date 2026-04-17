import { z } from "zod";

export const MetricNameSchema = z.string().min(1).max(200).brand("MetricName");
export type MetricName = z.infer<typeof MetricNameSchema>;

export const MetricValueSchema = z.number().finite();
export type MetricValue = z.infer<typeof MetricValueSchema>;
