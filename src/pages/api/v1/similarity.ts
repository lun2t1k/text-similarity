import {NextApiRequest, NextApiResponse} from 'next'
import {z} from 'zod'
import {withMethods} from '@/lib/api-middlewares/with-methods'
import {db} from '@/lib/db'
import {openai} from '@/lib/openai'
import { cosineSimilarity } from '@/helpers/cosine-similarity';

const requestShema = z.object({
  text1: z.string().max(1000),
  text2: z.string().max(1000)
})

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const body = request.body as unknown

  const apiKey = request.headers.authorization
  if (!apiKey) {
    return response.status(401).json({
      error: 'Unauthorized'
    })
  }

  try {
    const {text1, text2} = requestShema.parse(body)

    const validApiKey = await db.apiKey.findFirst({
      where: {key: apiKey, enabled: true}
    })

    if (!validApiKey) {
      return response.status(401).json({
        error: 'Unauthorized'
      })
    }

    const start = new Date()

    const embeddings = await Promise.all(
      [text1, text2].map(async text => {
        const response = await openai.createEmbedding({
          model: 'text-embedding-ada-002',
          input: text
        })

        return response.data.data[0].embedding
      })
    )

    const similarity = cosineSimilarity(embeddings[0], embeddings[1])
    const duration = new Date().getTime() - start.getTime()

    // Persist request
    await db.apiRequest.create({
      data: {
        duration,
        method: request.method as string,
        path: request.url as string,
        status: 200,
        apiKeyId: validApiKey.id,
        usedApiKey: validApiKey.key
      }
    })

    return response.status(200).json({
      success: true,
      text1,
      text2,
      similarity
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({
        error: error.issues
      })
    }

    return response.status(500).json({
      error: 'Internal Server Error'
    })
  }
}

export default withMethods(['POST'], handler)
