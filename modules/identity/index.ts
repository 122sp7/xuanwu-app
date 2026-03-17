/**
 * identity module public API
 */
export type { IdentityEntity, SignInCredentials, RegistrationInput } from "./domain/entities/Identity";
export type { IdentityRepository } from "./domain/repositories/IdentityRepository";
export {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignOutUseCase,
} from "./application/use-cases/identity.use-cases";
export { FirebaseIdentityRepository } from "./infrastructure/firebase/FirebaseIdentityRepository";
export {
  signIn,
  signInAnonymously,
  register,
  sendPasswordResetEmail,
  signOut,
} from "./interfaces/_actions/identity.actions";
