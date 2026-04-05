export class BacklinkExtractorService {
  extractWikilinkTitles(content: string): string[] {
    const regex = /\[\[([^\]]+)\]\]/g;
    const titles = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      titles.add(match[1].trim());
    }
    return Array.from(titles);
  }
}
