/**
 * identity module public API
 */
export type { IdentityEntity, SignInCredentials, RegistrationInput } from "./domain/entities/Identity";
export type { TokenRefreshSignal, TokenRefreshReason } from "./domain/entities/TokenRefreshSignal";
export type { IdentityRepository } from "./domain/repositories/IdentityRepository";
export type { TokenRefreshRepository } from "./domain/repositories/TokenRefreshRepository";
export {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignOutUseCase,
} from "./application/use-cases/identity.use-cases";
export { EmitTokenRefreshSignalUseCase } from "./application/use-cases/token-refresh.use-cases";
export { FirebaseIdentityRepository } from "./infrastructure/firebase/FirebaseIdentityRepository";
export { FirebaseTokenRefreshRepository } from "./infrastructure/firebase/FirebaseTokenRefreshRepository";
export {
  signIn,
  signInAnonymously,
  register,
  sendPasswordResetEmail,
  signOut,
} from "./interfaces/_actions/identity.actions";
// Client-only hook — must be imported from the module barrel only from "use client" files
// to avoid RSC bundle contamination.
export { useTokenRefreshListener } from "./interfaces/hooks/useTokenRefreshListener";
