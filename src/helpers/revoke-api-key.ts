export const revokeApiKey = async ({keyId}: {keyId: string}) => {
  const response = await fetch('/api/api-key/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({keyId})
  })

  const data = (await response.json()) as {error?: string}
  if (data.error) throw new Error(data.error)
}
