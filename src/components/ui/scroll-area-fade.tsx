import React, { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from 'cn'

interface ScrollAreaFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  fadeSize?: number
}

/**
 * ScrollAreaFade: Contêiner de rolagem com máscara de gradiente dinâmica e inteligente.
 * Regra: NUNCA aplica fade no topo se scrollTop === 0.
 * O fade superior só aparece quando o usuário realmente rola para baixo (scrollTop > 4).
 * O fade inferior só aparece se houver conteúdo além da área visível.
 */
export function ScrollAreaFade({
  children,
  className,
  fadeSize = 20,
  ...props
}: ScrollAreaFadeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollTop, setCanScrollTop] = useState(false)
  const [canScrollBottom, setCanScrollBottom] = useState(false)

  const updateScrollEdges = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const threshold = 4

    // Só tem fade no topo se o usuário tiver rolado além do início
    const hasTop = scrollTop > threshold

    // Só tem fade na base se houver conteúdo oculto abaixo
    const hasBottom = scrollTop + clientHeight < scrollHeight - threshold

    setCanScrollTop(hasTop)
    setCanScrollBottom(hasBottom)
  }, [])

  useEffect(() => {
    updateScrollEdges()

    const el = containerRef.current
    if (!el) return

    // Recalcula ao mudar conteúdo ou redimensionar a tela/drawer
    const ro = new ResizeObserver(() => {
      updateScrollEdges()
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [children, updateScrollEdges])

  // Máscara dinâmica calculada de acordo com o estado do scroll
  let maskImage = 'none'
  if (canScrollTop && canScrollBottom) {
    maskImage = `linear-gradient(to bottom, transparent 0px, black ${fadeSize}px, black calc(100% - ${fadeSize}px), transparent 100%)`
  } else if (canScrollTop && !canScrollBottom) {
    maskImage = `linear-gradient(to bottom, transparent 0px, black ${fadeSize}px, black 100%)`
  } else if (!canScrollTop && canScrollBottom) {
    maskImage = `linear-gradient(to bottom, black 0%, black calc(100% - ${fadeSize}px), transparent 100%)`
  }

  return (
    <div
      ref={containerRef}
      onScroll={updateScrollEdges}
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
        WebkitOverflowScrolling: 'touch',
      }}
      className={cn('overflow-y-auto overscroll-contain scrollbar-subtle', className)}
      {...props}
    >
      {children}
    </div>
  )
}
