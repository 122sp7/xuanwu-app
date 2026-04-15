// inbound
export { TemplateController, buildTemplateRoutes } from './inbound';
export type { HttpRoute } from './inbound';
export { TemplateQueueHandler } from './inbound';

// outbound
export {
  FirestoreTemplateRepository,
  FirestoreMapper,
  TemplateCacheAdapter,
  TemplateApiClient,
} from './outbound';
export type { FirestoreLike, TemplateDocument } from './outbound';
