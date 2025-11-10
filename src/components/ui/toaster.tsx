import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, style, ...props }) {
        const isCustomStyle = style?.backgroundColor === '#7D5FBB';
        return (
          <Toast key={id} {...props} style={style}>
            <div className="grid gap-1">
              {title && <ToastTitle className={isCustomStyle ? "text-white" : ""}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={isCustomStyle ? "text-white opacity-100" : ""}>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={isCustomStyle ? "text-white hover:text-white/80" : ""} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
