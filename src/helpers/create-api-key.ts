import {CreateApiData} from '@/types/api'

export const createApiKey = async () => {
  const response = await fetch('/api/api-key/create')
  const data = (await response.json()) as CreateApiData

  if (data.error || !data.createdApiKey) {
    if (data.error instanceof Array) throw new Error(data.error.join(' '))
    throw new Error(data.error ?? 'Something went wrong.')
  }

  return data.createdApiKey.key
}
