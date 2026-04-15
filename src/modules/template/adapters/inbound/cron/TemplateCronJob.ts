// src/modules/template/adapters/inbound/cron/TemplateCronJob.ts

/**
 * OPTIONAL ADAPTER
 * 僅在需要「定時任務」時使用
 * 例如：batch job / cleanup / sync / billing
 */
export class TemplateCronJob {
  constructor(private createTemplateUseCase: any) {}

  async run() {
    await this.createTemplateUseCase.execute({
      name: "cron-template",
      userId: "system",
    });
  }
}