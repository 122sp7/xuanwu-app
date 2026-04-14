/**
 * Platform compatibility façade for identity.
 * Canonical ownership now lives in the IAM bounded context.
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
} from "@/modules/iam/subdomains/identity/api";

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
} from "@/modules/iam/subdomains/identity/api";
