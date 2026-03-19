/**
 * @module lib/vis/data
 * Thin wrapper for vis-data.
 *
 * vis-data provides DataSet and DataView for managing and synchronizing
 * large collections of structured data with change notifications.
 *
 * Usage:
 *   import { DataSet } from "@/lib/vis/data";
 *   const dataSet = new DataSet([{ id: 1, label: "Node 1" }]);
 */

export { DataSet, DataView } from "vis-data/esnext";
export type {
  DataItem,
  DataSetOptions,
  DataViewOptions,
  IdType,
} from "vis-data/esnext";
