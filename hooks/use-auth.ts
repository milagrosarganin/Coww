"use client"

import { useEffect, useState, useCallback } from "react"
import type { AuthChangeEvent, Session, User as SupaUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase"

type User = {
  id: string
  email: string | undefined // <- alinea con supabase-js
  user_metadata?: { full_name?: string }
}

export function useAuth() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      setUser(mapUser(session?.user ?? null))
      setLoading(false)
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(mapUser(session?.user ?? null))
      }
    )

    init()
    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error }
  }, [supabase])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [supabase])

  return { user, loading, signIn, signUp, signOut }
}

function mapUser(u: SupaUser | null): User | null {
  if (!u) return null
  return {
    id: u.id,
    email: u.email, // string | undefined
    user_metadata: { full_name: (u.user_metadata as any)?.full_name },
  }
}
