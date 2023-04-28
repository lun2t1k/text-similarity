import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth'
import {z} from 'zod'
import {withMethods} from '@/lib/api-middlewares/with-methods'
import {authOptions} from '@/lib/auth'
import {RevokeApiData} from '@/types/api'
import {db} from '@/lib/db'

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<RevokeApiData>
) => {
  try {
    const user = await getServerSession(request, response, authOptions).then(
      response => response?.user
    )

    if (!user) {
      return response.status(401).json({
        error: 'Unauthorized',
        success: false
      })
    }

    const validApiKey = await db.apiKey.findFirst({
      where: {userId: user.id, enabled: true}
    })

    if (!validApiKey) {
      return response.status(500).json({
        error: 'This API key could not be revoked.',
        success: false
      })
    }

    // invalidate API key
    await db.apiKey.update({
      where: {id: validApiKey.id},
      data: {
        enabled: false
      }
    })

    return response.status(200).json({error: null, success: true})
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({
        error: error.issues,
        success: false
      })
    }

    return response.status(500).json({
      error: 'Internal Server Error',
      success: false
    })
  }
}

export default withMethods(['POST'], handler)
