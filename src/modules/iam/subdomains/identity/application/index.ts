// ── DTOs ──────────────────────────────────────────────────────────────────────
export type {
  IdentityEntity,
  SignInCredentials,
  RegistrationInput,
} from "./dto/IdentityDTO";
export type { TokenRefreshSignal, TokenRefreshReason } from "./dto/IdentityDTO";
export type { UserIdentitySnapshot, CreateIdentityInput } from "./dto/IdentityDTO";

// ── Use cases ─────────────────────────────────────────────────────────────────
export {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignOutUseCase,
} from "./use-cases/IdentityUseCases";

export { EmitTokenRefreshSignalUseCase } from "./use-cases/TokenRefreshUseCases";
