import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('imerso-theme')
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
    return 'dark' // Dark first default
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('imerso-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      if (next === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      return next
    })
  }

  return { theme, setTheme, toggleTheme }
}
