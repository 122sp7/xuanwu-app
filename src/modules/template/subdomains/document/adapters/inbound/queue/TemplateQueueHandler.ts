/**
 * OPTIONAL ADAPTER
 * 僅在需要「非同步背景處理」時使用
 * 例如：AI 任務 / email / 長時間 job
 */
export class TemplateQueueHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private createTemplateUseCase: any) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(message: any) {
    const data =
      typeof message === 'string' ? JSON.parse(message) : message;

    if (data.type === 'template.create') {
      await this.createTemplateUseCase.execute(data);
    }
  }
}
