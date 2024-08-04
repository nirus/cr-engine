/**
 * Build for SSR api interface future idea
 * TODO: Future implementation SSR exposing rest endpoint
 */
import { fetchAuthor } from '@request/fetchAuthor'

export async function post({ request }: { request: Body }) {
  try {
    const incoming: { author: string } = await request.json()
    const data = await fetchAuthor(incoming)
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Something went wrong!' }), {
      status: 500,
    })
  }
}

export async function get() {
  return new Response(JSON.stringify({ message: 'No implementation' }), {
    status: 501,
  })
}
