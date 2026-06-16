const connectionString = process.env.DATABASE_URL

export function hasDatabaseUrl(): boolean {
  return Boolean(connectionString?.trim())
}

export async function getSql() {
  if (!connectionString?.trim()) {
    throw new Error("DATABASE_URL is not set.")
  }
  const { neon } = await import("@neondatabase/serverless")
  return neon(connectionString)
}
