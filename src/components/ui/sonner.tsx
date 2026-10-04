import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      closeButton
      className="toaster group"
      toastOptions={{
        style: {
          border: "none",
          borderRadius: "12px",
          padding: "10px 14px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        classNames: {
          toast: "cn-toast !bg-popover !text-popover-foreground !border-border !shadow-md !pr-8",
          closeButton: "!bg-muted !text-muted-foreground hover:!bg-accent hover:!text-accent-foreground !border-none !rounded-full !size-5 !top-3 !right-3 !left-auto !transform-none !flex !items-center !justify-center !transition-all !cursor-pointer [&_svg]:!size-3",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
