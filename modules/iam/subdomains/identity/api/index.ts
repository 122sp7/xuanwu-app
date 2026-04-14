/**
 * IAM identity public API.
 * Canonical owner boundary for authentication and identity lifecycle concerns.
 */

export {
  toIdentityErrorMessage,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignInAnonymouslyUseCase,
  SignInUseCase,
  SignOutUseCase,
  EmitTokenRefreshSignalUseCase,
} from "../application";

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
} from "../interfaces";

export {
  createIdentityRepository,
  createTokenRefreshRepository,
  createClientAuthUseCases,
  identityApi,
} from "../interfaces/composition/identity-service";

export type { EmitTokenRefreshSignalInput } from "../interfaces/composition/identity-service";
export type { IdentityEntity, RegistrationInput, SignInCredentials } from "../domain/entities/Identity";
export type { TokenRefreshReason, TokenRefreshSignal } from "../domain/entities/TokenRefreshSignal";
export type { Email } from "../domain/value-objects/Email";
export type { UserId } from "../domain/value-objects/UserId";
export type { DisplayName } from "../domain/value-objects/DisplayName";
export type { IdentityStatus } from "../domain/value-objects/IdentityStatus";
export type {
  AuthState,
  AuthAction,
  AuthContextValue,
  AuthStatus,
  AuthUser,
} from "../interfaces";
