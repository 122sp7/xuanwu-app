import type { SignInUseCase } from "../../../application/use-cases/IdentityUseCases";
import type { SignInAnonymouslyUseCase } from "../../../application/use-cases/IdentityUseCases";
import type { RegisterUseCase } from "../../../application/use-cases/IdentityUseCases";
import type { SendPasswordResetEmailUseCase } from "../../../application/use-cases/IdentityUseCases";
import type { SignOutUseCase } from "../../../application/use-cases/IdentityUseCases";
import type { SignInCredentials, RegistrationInput } from "../../../domain/entities/Identity";

/** HTTP inbound adapter stub — translates HTTP requests into identity use-case calls. */
export class IdentityController {
  constructor(
    private readonly signInUC: SignInUseCase,
    private readonly signInAnonUC: SignInAnonymouslyUseCase,
    private readonly registerUC: RegisterUseCase,
    private readonly passwordResetUC: SendPasswordResetEmailUseCase,
    private readonly signOutUC: SignOutUseCase,
  ) {}

  async signIn(body: SignInCredentials) {
    return this.signInUC.execute(body);
  }

  async signInAnonymously() {
    return this.signInAnonUC.execute();
  }

  async register(body: RegistrationInput) {
    return this.registerUC.execute(body);
  }

  async sendPasswordReset(body: { email: string }) {
    return this.passwordResetUC.execute(body.email);
  }

  async signOut() {
    return this.signOutUC.execute();
  }
}
