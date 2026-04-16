import type { AuthCredential, AuthenticationPort } from "../../domain/index";

export class SignInWithEmailUseCase {
  constructor(private readonly authPort: AuthenticationPort) {}

  async execute(input: { email: string; password: string }): Promise<AuthCredential> {
    const result = await this.authPort.signInWithEmail(input.email, input.password);
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
    return { uid: result.uid, email: input.email, idToken: result.idToken, expiresAt };
  }
}

export class SignOutUseCase {
  constructor(private readonly authPort: AuthenticationPort) {}

  async execute(input: { uid: string }): Promise<void> {
    await this.authPort.signOut(input.uid);
  }
}

export class SendPasswordResetEmailUseCase {
  constructor(private readonly authPort: AuthenticationPort) {}

  async execute(input: { email: string }): Promise<void> {
    await this.authPort.sendPasswordResetEmail(input.email);
  }
}
