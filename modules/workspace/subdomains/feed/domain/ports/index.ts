/**
 * workspace/feed domain/ports — driven port interfaces for the feed subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type {
  WorkspaceFeedPostRepository as IWorkspaceFeedPostPort,
  WorkspaceFeedInteractionRepository as IWorkspaceFeedInteractionPort,
} from "../repositories/workspace-feed.repositories";
