/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: OpenAI Embeddings API adapter — converts text chunks to Embedding value objects.
 *          Uses native fetch to avoid adding an openai package dependency; requires
 *          OPENAI_API_KEY environment variable at runtime.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { IEmbeddingRepository, EmbedTextDTO } from '@wiki-core'
import { Embedding } from '@wiki-core'

const MAX_BATCH = 20
const DEFAULT_MODEL = 'text-embedding-3-small'
const DEFAULT_DIMENSIONS = 1536
const OPENAI_EMBEDDINGS_URL = 'https://api.openai.com/v1/embeddings'

interface OpenAIEmbeddingResponse {
  data: Array<{ embedding: number[]; index: number }>
  model: string
  usage: { prompt_tokens: number; total_tokens: number }
}

export class OpenAIEmbeddingRepository implements IEmbeddingRepository {
  private readonly model: string
  private readonly dimensions: number
  private readonly apiKey: string

  constructor(
    apiKey: string,
    model = DEFAULT_MODEL,
    dimensions = DEFAULT_DIMENSIONS,
  ) {
    if (!apiKey.trim()) {
      throw new Error(
        'OpenAIEmbeddingRepository: apiKey is required and cannot be empty. ' +
          'Ensure OPENAI_API_KEY environment variable is set or pass a valid key to the constructor.',
      )
    }
    this.apiKey = apiKey
    this.model = model
    this.dimensions = dimensions
  }

  async embed(dto: EmbedTextDTO): Promise<Embedding> {
    const [result] = await this.embedBatch([dto])
    return result
  }

  async embedBatch(dtos: EmbedTextDTO[]): Promise<Embedding[]> {
    if (dtos.length === 0) {
      return []
    }
    if (dtos.length > MAX_BATCH) {
      throw new Error(`OpenAIEmbeddingRepository: max batch size is ${MAX_BATCH}`)
    }

    const response = await fetch(OPENAI_EMBEDDINGS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: dtos.map((d) => d.text),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(
        `OpenAI Embeddings API error ${response.status}: ${errorText}`,
      )
    }

    const json = (await response.json()) as OpenAIEmbeddingResponse

    return json.data
      .sort((a, b) => a.index - b.index)
      .map(
        (item) =>
          new Embedding({
            values: item.embedding,
            model: this.model,
            dimensions: this.dimensions,
          }),
      )
  }
}
