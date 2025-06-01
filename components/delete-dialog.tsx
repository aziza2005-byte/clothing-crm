"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, AlertTriangle } from "lucide-react"
import { useNotifications } from "@/components/notifications-provider"

interface DeleteDialogProps {
  itemName: string
  onDelete: () => void
  translations: {
    delete: string
    confirmDelete: string
    deleteDescription: string
    cancel: string
    confirm: string
    deleteSuccess: string
  }
  variant?: "default" | "destructive"
  size?: "sm" | "default" | "lg"
  showIcon?: boolean
}

export function DeleteDialog({
  itemName,
  onDelete,
  translations,
  variant = "destructive",
  size = "sm",
  showIcon = true,
}: DeleteDialogProps) {
  const { addNotification } = useNotifications()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800))

      onDelete()

      // Show success notification
      addNotification({
        title: translations.deleteSuccess,
        message: `${itemName} has been permanently removed`,
        type: "success",
        autoClose: true,
      })

      setIsOpen(false)
    } catch (error) {
      console.error("Delete failed:", error)

      addNotification({
        title: "Delete Failed",
        message: `Failed to delete ${itemName}. Please try again.`,
        type: "error",
        autoClose: true,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant="outline"
          className={`${
            variant === "destructive"
              ? "text-red-400 border-red-600 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
              : "text-gray-400 border-gray-600 hover:bg-gray-500/10"
          } transition-all duration-200`}
        >
          <Trash2 className="h-4 w-4" />
          {size !== "sm" && <span className="ml-2">{translations.delete}</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-red-400">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            {translations.confirmDelete}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 mt-4">
            {translations.deleteDescription.replace("{item}", `"${itemName}"`)}
          </AlertDialogDescription>
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-300 font-medium">⚠️ This action is permanent and cannot be undone.</p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            className="bg-transparent text-white border-gray-600 hover:bg-gray-700"
            disabled={isDeleting}
          >
            {translations.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className="bg-red-600 hover:bg-red-700 text-white border-none"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {translations.confirm}
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
