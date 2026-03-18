export class KnowledgeSerializer {
  static serialize(data: any) {
    return {
      data,
      meta: { timestamp: new Date().toISOString() }
    };
  }
}