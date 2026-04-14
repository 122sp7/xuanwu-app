/**
 * IAM identity public API.
 * Transitional canonical boundary while implementation is converged from legacy owners.
 */

export {
  AuthProvider,
  useAuth,
  ShellGuard,
  createIdentityRepository,
  createTokenRefreshRepository,
  createClientAuthUseCases,
  identityApi,
} from "@/modules/platform/subdomains/identity/api";

export type {
  EmitTokenRefreshSignalInput,
  IdentityEntity,
  RegistrationInput,
  SignInCredentials,
  TokenRefreshReason,
  TokenRefreshSignal,
  Email,
  UserId,
  DisplayName,
  IdentityStatus,
} from "@/modules/platform/subdomains/identity/api";
