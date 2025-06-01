"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, FileText, FileJson } from "lucide-react"
import * as XLSX from "xlsx"
import { useNotifications } from "@/components/notifications-provider"

interface ExportDialogProps {
  data: any[]
  filename: string
  translations: {
    exportData: string
    exportOptions: string
    selectFields: string
    selectFormat: string
    export: string
    cancel: string
    processing: string
    exportSuccess: string
    exportFailed: string
    all: string
  }
}

export function ExportDialog({ data, filename, translations }: ExportDialogProps) {
  const { addNotification } = useNotifications()
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState("xlsx")
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFields, setSelectedFields] = useState<string[]>(Object.keys(data[0] || {}))

  const allFields = Object.keys(data[0] || {})

  const toggleField = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  const selectAllFields = () => {
    setSelectedFields(allFields)
  }

  const deselectAllFields = () => {
    setSelectedFields([])
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) return

    setIsExporting(true)
    setProgress(10)

    // Start notification
    addNotification({
      title: "Export Started",
      message: `Preparing ${data.length} records for export in ${format.toUpperCase()} format`,
      type: "info",
      autoClose: true,
    })

    try {
      // Filter data to only include selected fields
      const filteredData = data.map((item) => {
        const filteredItem: Record<string, any> = {}
        selectedFields.forEach((field) => {
          filteredItem[field] = item[field]
        })
        return filteredItem
      })

      setProgress(40)

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(70)

      // Export based on selected format
      if (format === "xlsx") {
        const worksheet = XLSX.utils.json_to_sheet(filteredData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
        XLSX.writeFile(workbook, `${filename}.xlsx`)
      } else if (format === "csv") {
        const worksheet = XLSX.utils.json_to_sheet(filteredData)
        const csv = XLSX.utils.sheet_to_csv(worksheet)
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${filename}.csv`
        link.click()
      } else if (format === "json") {
        const json = JSON.stringify(filteredData, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${filename}.json`
        link.click()
      }

      setProgress(100)

      // Success notification with details
      addNotification({
        title: translations.exportSuccess,
        message: `${data.length} records exported successfully as ${filename}.${format}`,
        type: "success",
        autoClose: true,
        action: {
          label: "Export Again",
          onClick: () => setOpen(true),
        },
      })

      // Analytics notification
      addNotification({
        title: "Export Analytics",
        message: `Export included ${selectedFields.length} fields from ${data.length} total records`,
        type: "info",
        autoClose: false,
      })

      // Close dialog after export
      setTimeout(() => {
        setOpen(false)
        setIsExporting(false)
        setProgress(0)
      }, 1500)
    } catch (error) {
      console.error("Export failed:", error)

      // Enhanced error notification
      addNotification({
        title: translations.exportFailed,
        message: `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
        autoClose: false,
        action: {
          label: "Retry",
          onClick: () => handleExport(),
        },
      })

      setIsExporting(false)
      setProgress(0)
    }
  }

  const formatIcons = {
    xlsx: <FileSpreadsheet className="h-4 w-4" />,
    csv: <FileText className="h-4 w-4" />,
    json: <FileJson className="h-4 w-4" />,
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black bg-white border-gray-600 hover:bg-gray-100">
          <Download className="h-4 w-4 mr-2" />
          {translations.exportData}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.exportData}</DialogTitle>
          <DialogDescription className="text-gray-400">{translations.exportOptions}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-white">{translations.selectFields}</Label>
            <div className="flex gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-white border-gray-600"
                onClick={selectAllFields}
              >
                {translations.all}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-white border-gray-600"
                onClick={deselectAllFields}
              >
                None
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-700/50 rounded-md">
              {allFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={selectedFields.includes(field)}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <Label htmlFor={field} className="text-sm text-gray-300 cursor-pointer">
                    {field}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="format" className="text-white">
              {translations.selectFormat}
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format" className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="xlsx" className="flex items-center">
                  <div className="flex items-center gap-2">
                    {formatIcons.xlsx}
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    {formatIcons.csv}
                    CSV (.csv)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    {formatIcons.json}
                    JSON (.json)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{translations.processing}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isExporting}>
            {translations.cancel}
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            {translations.export}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
