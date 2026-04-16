/**
 * iam inbound React adapter — barrel.
 *
 * Public surface for all IAM React inbound adapters.
 * Consumed by src/app/ route shims and platform/adapters/inbound/react/.
 */

export {
  IamSessionProvider,
  useIamSession,
  type AuthState,
  type AuthUser,
  type AuthStatus,
} from "./IamSessionProvider";

export { PublicLandingView } from "./PublicLandingView";
