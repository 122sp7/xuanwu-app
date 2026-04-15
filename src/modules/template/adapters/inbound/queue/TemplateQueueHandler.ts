// src/modules/template/adapters/inbound/queue/TemplateQueueHandler.ts

/**
 * OPTIONAL ADAPTER
 * 僅在需要「非同步背景處理」時使用
 * 例如：AI 任務 / email / 長時間 job
 */
export class TemplateQueueHandler {
  constructor(private createTemplateUseCase: any) {}

  async handle(message: any) {
    const data =
      typeof message === "string"
        ? JSON.parse(message)
        : message;

    if (data.type === "template.create") {
      await this.createTemplateUseCase.execute(data);
    }
  }
}