import type { CreateUserAccountUseCase } from "../../application/use-cases/AccountUseCases";
import type { UpdateUserProfileUseCase } from "../../application/use-cases/AccountUseCases";
import type { UpdateAccountProfileUseCase } from "../../application/use-cases/AccountUseCases";
import type { CreditWalletUseCase } from "../../application/use-cases/AccountUseCases";
import type { DebitWalletUseCase } from "../../application/use-cases/AccountUseCases";
import type { AssignAccountRoleUseCase } from "../../application/use-cases/AccountUseCases";
import type { RevokeAccountRoleUseCase } from "../../application/use-cases/AccountUseCases";

/** HTTP inbound adapter stub — translates HTTP requests into application use-case calls. */
export class AccountController {
  constructor(
    private readonly createAccountUC: CreateUserAccountUseCase,
    private readonly updateProfileUC: UpdateUserProfileUseCase,
    private readonly updateAccountProfileUC: UpdateAccountProfileUseCase,
    private readonly creditWalletUC: CreditWalletUseCase,
    private readonly debitWalletUC: DebitWalletUseCase,
    private readonly assignRoleUC: AssignAccountRoleUseCase,
    private readonly revokeRoleUC: RevokeAccountRoleUseCase,
  ) {}

  async createAccount(body: { userId: string; name: string; email: string }) {
    return this.createAccountUC.execute(body.userId, body.name, body.email);
  }

  async updateProfile(body: { userId: string; name?: string; bio?: string; photoURL?: string }) {
    return this.updateProfileUC.execute(body.userId, {
      name: body.name,
      bio: body.bio,
      photoURL: body.photoURL,
    });
  }

  async updateAccountProfile(body: { actorId: string; input: unknown }) {
    return this.updateAccountProfileUC.execute(body.actorId, body.input as never);
  }

  async creditWallet(body: { accountId: string; amount: number; description: string }) {
    return this.creditWalletUC.execute(body.accountId, body.amount, body.description);
  }

  async debitWallet(body: { accountId: string; amount: number; description: string }) {
    return this.debitWalletUC.execute(body.accountId, body.amount, body.description);
  }

  async assignRole(body: {
    accountId: string;
    role: string;
    grantedBy: string;
    traceId?: string;
  }) {
    return this.assignRoleUC.execute(
      body.accountId,
      body.role as never,
      body.grantedBy,
      body.traceId,
    );
  }

  async revokeRole(body: { accountId: string }) {
    return this.revokeRoleUC.execute(body.accountId);
  }
}
