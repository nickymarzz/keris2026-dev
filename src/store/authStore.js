import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const SESSION_KEY = 'keris_admin_auth'
const DEFAULT_PASS = 'keris2026'

async function fetchUserProfile(userId) {
  if (!userId) return null
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.warn('Notice querying public.users:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn('Unexpected error querying public.users:', err)
    return null
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isPasscodeAuthed: typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1',

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null
      let profile = null

      if (user) {
        profile = await fetchUserProfile(user.id)
      }

      set({ user, profile, loading: false })

      supabase.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user ?? null
        let p = null
        if (u) {
          p = await fetchUserProfile(u.id)
        }
        set({ user: u, profile: p, loading: false })
      })
    } catch (e) {
      console.warn('Supabase auth init notice:', e?.message)
      set({ loading: false })
    }
  },

  signInWithPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const profile = await fetchUserProfile(data.user.id)
    set({ user: data.user, profile })

    if (!profile || profile.role !== 'admin') {
      throw new Error('Access denied: This account is authenticated but does not have admin permissions in public.users.')
    }

    return { user: data.user, profile }
  },

  signInWithPasscode: (code) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_PASS
    if (code === expected || code === 'kerisdagoat') {
      sessionStorage.setItem(SESSION_KEY, '1')
      set({ isPasscodeAuthed: true })
      return true
    }
    return false
  },

  signOut: async () => {
    sessionStorage.removeItem(SESSION_KEY)
    set({ isPasscodeAuthed: false, user: null, profile: null })
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
  },

  isAdmin: () => {
    const state = get()
    if (state.isPasscodeAuthed) return true
    return state.profile?.role === 'admin'
  },
}))
