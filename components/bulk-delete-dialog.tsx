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

interface BulkDeleteDialogProps {
  selectedItems: string[]
  onDelete: (items: string[]) => void
  translations: {
    bulkDelete: string
    confirmBulkDelete: string
    bulkDeleteDescription: string
    cancel: string
    confirm: string
    bulkDeleteSuccess: string
  }
  itemType: string
}

export function BulkDeleteDialog({ selectedItems, onDelete, translations, itemType }: BulkDeleteDialogProps) {
  const { addNotification } = useNotifications()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleBulkDelete = async () => {
    setIsDeleting(true)

    try {
      // Add a delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onDelete(selectedItems)

      // Show success notification
      addNotification({
        title: translations.bulkDeleteSuccess,
        message: `${selectedItems.length} ${itemType}(s) have been permanently removed`,
        type: "success",
        autoClose: true,
      })

      setIsOpen(false)
    } catch (error) {
      console.error("Bulk delete failed:", error)

      addNotification({
        title: "Bulk Delete Failed",
        message: `Failed to delete selected ${itemType}s. Please try again.`,
        type: "error",
        autoClose: true,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (selectedItems.length === 0) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-400 border-red-600 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {translations.bulkDelete} ({selectedItems.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-red-400">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            {translations.confirmBulkDelete}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 mt-4">
            {translations.bulkDeleteDescription
              .replace("{count}", selectedItems.length.toString())
              .replace("{type}", itemType)}
          </AlertDialogDescription>
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-300 font-medium">
              ⚠️ This action will permanently delete {selectedItems.length} {itemType}(s) and cannot be undone.
            </p>
            <div className="mt-2 max-h-32 overflow-y-auto">
              <p className="text-xs text-red-200">Selected items:</p>
              <ul className="text-xs text-red-200 mt-1 space-y-1">
                {selectedItems.slice(0, 10).map((item, index) => (
                  <li key={index} className="truncate">
                    • {item}
                  </li>
                ))}
                {selectedItems.length > 10 && (
                  <li className="text-red-300">... and {selectedItems.length - 10} more</li>
                )}
              </ul>
            </div>
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
              handleBulkDelete()
            }}
            className="bg-red-600 hover:bg-red-700 text-white border-none"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deleting {selectedItems.length} items...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {translations.confirm} ({selectedItems.length})
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
