import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth'
import {nanoid} from 'nanoid'
import {z} from 'zod'
import {authOptions} from '@/lib/auth'
import {CreateApiData} from '@/types/api'
import {db} from '@/lib/db'
import {withMethods} from '@/lib/api-middlewares/with-methods'

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<CreateApiData>
) => {
  try {
    const user = await getServerSession(request, response, authOptions).then(
      response => response?.user
    )

    if (!user) {
      return response.status(401).json({
        error: 'Unauthorized to perform this action',
        createdApiKey: null
      })
    }

    const existingApiKey = await db.apiKey.findFirst({
      where: {userId: user.id, enabled: true}
    })

    if (existingApiKey) {
      return response.status(400).json({
        error: 'You already have a valid API key',
        createdApiKey: null
      })
    }

    const createdApiKey = await db.apiKey.create({
      data: {
        userId: user.id,
        key: nanoid()
      }
    })

    return response.status(200).json({error: null, createdApiKey})
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({
        error: error.issues,
        createdApiKey: null
      })
    }

    return response.status(500).json({
      error: 'Internal Server Error',
      createdApiKey: null
    })
  }
}

export default withMethods(['GET'], handler)
