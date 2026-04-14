/**
 * IAM identity public API.
 * Transitional canonical boundary while implementation is converged from legacy owners.
 */

export {
  AuthProvider,
  useAuth,
  ShellGuard,
  register,
  sendPasswordResetEmail,
  signIn,
  signInAnonymously,
  signOut,
  useTokenRefreshListener,
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
  AuthState,
  AuthAction,
  AuthContextValue,
  AuthStatus,
  AuthUser,
} from "@/modules/platform/subdomains/identity/api";
