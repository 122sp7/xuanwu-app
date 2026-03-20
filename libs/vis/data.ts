/**
 * @module libs/vis/data
 * Thin wrapper for vis-data.
 *
 * vis-data provides DataSet and DataView for managing and synchronizing
 * large collections of structured data with change notifications.
 *
 * Usage:
 *   import { DataSet } from "@/libs/vis/data";
 *   const dataSet = new DataSet([{ id: 1, label: "Node 1" }]);
 */

export { DataSet, DataView } from "vis-data/esnext";
export type {
  DataSetOptions,
  DataViewOptions,
  DataInterface,
  DataInterfaceGetOptions,
  DataInterfaceGetOptionsArray,
  DataInterfaceGetOptionsObject,
  DataInterfaceOrder,
} from "vis-data/esnext";

export {
  DataStream,
  Queue,
  createNewDataPipeFrom,
  isDataSetLike,
  isDataViewLike,
} from "vis-data/esnext";
