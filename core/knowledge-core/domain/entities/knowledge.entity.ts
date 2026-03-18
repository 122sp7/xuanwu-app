export class Knowledge {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public status: 'DRAFT' | 'PUBLISHED',
    public readonly createdAt: Date
  ) {}
}