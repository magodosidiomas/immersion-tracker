import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={isMobile ? "top-center" : "bottom-right"}
      offset={isMobile ? { top: 16 } : 24}
      mobileOffset={{ top: 16 }}
      swipeDirections={isMobile ? ["top", "right", "left"] : ["bottom", "right", "left"]}
      duration={2200}
      visibleToasts={1}
      className="toaster group"
      toastOptions={{
        style: {
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "10px 16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          cursor: "grab",
          userSelect: "none",
        },
        classNames: {
          toast: "cn-toast !bg-popover !text-popover-foreground !border-border !shadow-lg active:cursor-grabbing",
          description: "!text-muted-foreground !text-xs",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
