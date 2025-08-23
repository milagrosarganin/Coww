export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return new Response(
    JSON.stringify({ hasUrl: !!url, hasAnon: !!anon }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}
