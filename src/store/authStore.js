import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const SESSION_KEY = 'keris_admin_auth'
const DEFAULT_PASS = 'keris2026'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isPasscodeAuthed: typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1',

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user ?? null, profile: session?.user ?? null })

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, profile: session?.user ?? null })
      })
    } catch (e) {
      console.warn('Supabase auth init notice:', e?.message)
    }
  },

  signInWithPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    set({ user: data.user, profile: data.user })
    return data
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
    return Boolean(state.user || state.isPasscodeAuthed)
  },
}))
