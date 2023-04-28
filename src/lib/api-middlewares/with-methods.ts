import {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'

export const withMethods = (methods: string[], handler: NextApiHandler) => {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    if (!request.method || !methods.includes(request.method)) {
      return response.status(405).end()
    }

    return handler(request, response)
  }
}
