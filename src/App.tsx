import { useState, useEffect } from 'react'
import { ImersoApp } from '@/components/ImersoApp'
import { StorybookView } from '@/components/StorybookView'
import { DesignLabView, type DesignDirection } from '@/components/DesignLabView'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useTheme } from '@/hooks/use-theme'
import { checkAndHandleOAuthRedirect } from '@/lib/google-drive'

export function App() {
  const [currentView, setCurrentView] = useState<'app' | 'storybook' | 'design-lab'>('app')
  const [direction, setDirection] = useState<DesignDirection>(() => {
    const saved = localStorage.getItem('imerso-direction')
    if (saved === 'industrial' || saved === 'editorial' || saved === 'amber') {
      return saved
    }
    return 'industrial'
  })

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    localStorage.setItem('imerso-direction', direction)
  }, [direction])

  useEffect(() => {
    checkAndHandleOAuthRedirect().then((res) => {
      if (res?.user) {
        toast.success(`Conectado ao Google Drive como ${res.user.name}`)
      }
    })
  }, [])

  const handleApplyDirection = (dir: DesignDirection) => {
    setDirection(dir)
    setCurrentView('app')
  }

  return (
    <>
      <Toaster richColors />
      {currentView === 'design-lab' ? (
        <DesignLabView
          currentTheme={theme}
          onToggleTheme={toggleTheme}
          selectedDirection={direction}
          onApplyDirection={handleApplyDirection}
          onBackToApp={() => setCurrentView('app')}
        />
      ) : currentView === 'storybook' ? (
        <StorybookView
          theme={theme}
          onToggleTheme={toggleTheme}
          onBackToApp={() => setCurrentView('app')}
        />
      ) : (
        <ImersoApp
          theme={theme}
          direction={direction}
          onToggleTheme={toggleTheme}
          onOpenStorybook={() => setCurrentView('storybook')}
          onOpenDesignLab={() => setCurrentView('design-lab')}
        />
      )}
    </>
  )
}

export default App
