"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Package } from "lucide-react"
import { ExportDialog } from "@/components/export-dialog"
import { DeleteDialog } from "@/components/delete-dialog"
import { useNotifications } from "@/components/notifications-provider"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  sku: string
  supplier: string
  status: "active" | "inactive" | "low_stock"
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    category: "T-Shirts",
    price: 15.99,
    stock: 150,
    description: "Premium cotton white t-shirt",
    sku: "TS-001",
    supplier: "Cotton Co.",
    status: "active",
  },
  {
    id: "2",
    name: "Blue Denim Jeans",
    category: "Jeans",
    price: 45.99,
    stock: 8,
    description: "Classic blue denim jeans",
    sku: "JN-001",
    supplier: "Denim Works",
    status: "low_stock",
  },
  {
    id: "3",
    name: "Summer Floral Dress",
    category: "Dresses",
    price: 35.99,
    stock: 75,
    description: "Light summer dress with floral pattern",
    sku: "DR-001",
    supplier: "Fashion Plus",
    status: "active",
  },
  {
    id: "4",
    name: "Leather Jacket",
    category: "Jackets",
    price: 89.99,
    stock: 2,
    description: "Genuine leather jacket",
    sku: "JK-001",
    supplier: "Leather Craft",
    status: "low_stock",
  },
  {
    id: "5",
    name: "Cotton Polo Shirt",
    category: "T-Shirts",
    price: 25.99,
    stock: 120,
    description: "Premium cotton polo shirt",
    sku: "PS-001",
    supplier: "Cotton Co.",
    status: "active",
  },
  // Add more products to reach 50
  ...Array.from({ length: 45 }, (_, i) => ({
    id: (i + 6).toString(),
    name: `Product ${i + 6}`,
    category: ["T-Shirts", "Jeans", "Dresses", "Jackets"][i % 4],
    price: Math.floor(Math.random() * 100) + 10,
    stock: Math.floor(Math.random() * 200) + 1,
    description: `Description for product ${i + 6}`,
    sku: `SKU-${String(i + 6).padStart(3, "0")}`,
    supplier: ["Cotton Co.", "Denim Works", "Fashion Plus", "Leather Craft"][i % 4],
    status: Math.random() > 0.8 ? "low_stock" : ("active" as "active" | "low_stock"),
  })),
]

export default function ProductsPage() {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [language, setLanguage] = useState("en")
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    sku: "",
    supplier: "",
    status: "active",
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
  }, [router])

  const translations = {
    en: {
      products: "Products",
      productManagement: "Product Management",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      exportData: "Export Data",
      search: "Search products...",
      name: "Name",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      lowStock: "Low Stock",
      sku: "SKU",
      supplier: "Supplier",
      description: "Description",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      addNewProduct: "Add New Product",
      editProductDetails: "Edit Product Details",
      productDetails: "Enter product details",
      exportOptions: "Export Options",
      selectFields: "Select Fields",
      selectFormat: "Select Format",
      export: "Export",
      processing: "Processing...",
      exportSuccess: "Export completed successfully",
      exportFailed: "Export failed",
      all: "All",
      confirmDelete: "Confirm Delete",
      deleteDescription: "Are you sure you want to delete {item}? This action cannot be undone.",
      deleteSuccess: "Product deleted successfully",
      productAdded: "Product added successfully",
      productUpdated: "Product updated successfully",
    },
    uz: {
      products: "Mahsulotlar",
      productManagement: "Mahsulot boshqaruvi",
      addProduct: "Mahsulot qo'shish",
      editProduct: "Mahsulotni tahrirlash",
      exportData: "Ma'lumotlarni eksport qilish",
      search: "Mahsulotlarni qidirish...",
      name: "Nomi",
      category: "Kategoriya",
      price: "Narx",
      stock: "Qoldiq",
      status: "Holat",
      actions: "Amallar",
      active: "Faol",
      inactive: "Nofaol",
      lowStock: "Kam qoldiq",
      sku: "SKU",
      supplier: "Yetkazib beruvchi",
      description: "Tavsif",
      save: "Saqlash",
      cancel: "Bekor qilish",
      edit: "Tahrirlash",
      delete: "O'chirish",
      addNewProduct: "Yangi mahsulot qo'shish",
      editProductDetails: "Mahsulot ma'lumotlarini tahrirlash",
      productDetails: "Mahsulot ma'lumotlarini kiriting",
      exportOptions: "Eksport variantlari",
      selectFields: "Maydonlarni tanlang",
      selectFormat: "Formatni tanlang",
      export: "Eksport",
      processing: "Qayta ishlanmoqda...",
      exportSuccess: "Eksport muvaffaqiyatli yakunlandi",
      exportFailed: "Eksport muvaffaqiyatsiz",
      all: "Hammasi",
      confirmDelete: "O'chirishni tasdiqlang",
      deleteDescription: "{item}ni o'chirishga ishonchingiz komilmi? Bu amalni bekor qilib bo'lmaydi.",
      deleteSuccess: "Mahsulot muvaffaqiyatli o'chirildi",
      productAdded: "Mahsulot muvaffaqiyatli qo'shildi",
      productUpdated: "Mahsulot muvaffaqiyatli yangilandi",
    },
    ru: {
      products: "Продукты",
      productManagement: "Управление продуктами",
      addProduct: "Добавить продукт",
      editProduct: "Редактировать продукт",
      exportData: "Экспорт данных",
      search: "Поиск продуктов...",
      name: "Название",
      category: "Категория",
      price: "Цена",
      stock: "Запас",
      status: "Статус",
      actions: "Действия",
      active: "Активный",
      inactive: "Неактивный",
      lowStock: "Низкий запас",
      sku: "SKU",
      supplier: "Поставщик",
      description: "Описание",
      save: "Сохранить",
      cancel: "Отмена",
      edit: "Редактировать",
      delete: "Удалить",
      addNewProduct: "Добавить новый продукт",
      editProductDetails: "Редактировать детали продукта",
      productDetails: "Введите детали продукта",
      exportOptions: "Параметры экспорта",
      selectFields: "Выберите поля",
      selectFormat: "Выберите формат",
      export: "Экспорт",
      processing: "Обработка...",
      exportSuccess: "Экспорт успешно завершен",
      exportFailed: "Экспорт не удался",
      all: "Все",
      confirmDelete: "Подтвердить удаление",
      deleteDescription: "Вы уверены, что хотите удалить {item}? Это действие нельзя отменить.",
      deleteSuccess: "Продукт успешно удален",
      productAdded: "Продукт успешно добавлен",
      productUpdated: "Продукт успешно обновлен",
    },
  }

  const t = translations[language as keyof typeof translations]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price && newProduct.stock) {
      const product: Product = {
        id: (products.length + 1).toString(),
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        stock: newProduct.stock,
        description: newProduct.description || "",
        sku: newProduct.sku || `SKU-${String(products.length + 1).padStart(3, "0")}`,
        supplier: newProduct.supplier || "",
        status: newProduct.stock < 10 ? "low_stock" : "active",
      }
      setProducts([...products, product])
      setNewProduct({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
        sku: "",
        supplier: "",
        status: "active",
      })
      setIsAddDialogOpen(false)

      // Enhanced notifications
      addNotification({
        title: t.productAdded,
        message: `${product.name} has been successfully added to inventory`,
        type: "success",
        autoClose: true,
        duration: 4000,
      })

      // Add low stock warning if applicable
      if (product.stock < 10) {
        addNotification({
          title: "Low Stock Warning",
          message: `${product.name} has low stock (${product.stock} items remaining)`,
          type: "warning",
          autoClose: false,
          action: {
            label: "Reorder",
            onClick: () => {
              addNotification({
                title: "Reorder Initiated",
                message: `Reorder process started for ${product.name}`,
                type: "info",
              })
            },
          },
        })
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...editingProduct,
              status: editingProduct.stock < 10 ? "low_stock" : "active",
            }
          : product,
      )
      setProducts(updatedProducts)
      setIsEditDialogOpen(false)

      const oldProduct = products.find((p) => p.id === editingProduct.id)

      // Enhanced update notification
      addNotification({
        title: t.productUpdated,
        message: `${editingProduct.name} details have been updated successfully`,
        type: "success",
        autoClose: true,
      })

      // Check for stock changes
      if (oldProduct && oldProduct.stock !== editingProduct.stock) {
        if (editingProduct.stock < 10 && oldProduct.stock >= 10) {
          addNotification({
            title: "Stock Alert",
            message: `${editingProduct.name} stock is now low (${editingProduct.stock} items)`,
            type: "warning",
            autoClose: false,
          })
        } else if (editingProduct.stock >= 10 && oldProduct.stock < 10) {
          addNotification({
            title: "Stock Replenished",
            message: `${editingProduct.name} stock has been replenished (${editingProduct.stock} items)`,
            type: "success",
          })
        }
      }

      // Check for price changes
      if (oldProduct && oldProduct.price !== editingProduct.price) {
        const priceChange = editingProduct.price > oldProduct.price ? "increased" : "decreased"
        addNotification({
          title: "Price Updated",
          message: `${editingProduct.name} price ${priceChange} from $${oldProduct.price} to $${editingProduct.price}`,
          type: "info",
        })
      }

      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find((p) => p.id === productId)
    setProducts(products.filter((product) => product.id !== productId))

    if (productToDelete) {
      addNotification({
        title: "Product Deleted",
        message: `${productToDelete.name} has been permanently removed from inventory`,
        type: "success",
        autoClose: true,
        action: {
          label: "Undo",
          onClick: () => {
            setProducts((prev) => [...prev, productToDelete])
            addNotification({
              title: "Product Restored",
              message: `${productToDelete.name} has been restored to inventory`,
              type: "info",
            })
          },
        },
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">{t.active}</Badge>
      case "inactive":
        return <Badge variant="secondary">{t.inactive}</Badge>
      case "low_stock":
        return <Badge className="bg-yellow-600">{t.lowStock}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.products}</h1>
            <p className="text-gray-300">{t.productManagement}</p>
          </div>
          <div className="flex gap-2">
            <ExportDialog data={products} filename="products" translations={t} />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addProduct}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>{t.addNewProduct}</DialogTitle>
                  <DialogDescription className="text-gray-300">{t.productDetails}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">{t.sku}</Label>
                      <Input
                        id="sku"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">{t.category}</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                          <SelectItem value="Jeans">Jeans</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">{t.supplier}</Label>
                      <Input
                        id="supplier"
                        value={newProduct.supplier}
                        onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">{t.price}</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">{t.stock}</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t.description}</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                    {t.save}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>{t.editProduct}</DialogTitle>
              <DialogDescription className="text-gray-300">{t.editProductDetails}</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">{t.name}</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sku">{t.sku}</Label>
                    <Input
                      id="edit-sku"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">{t.category}</Label>
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                        <SelectItem value="Jeans">Jeans</SelectItem>
                        <SelectItem value="Dresses">Dresses</SelectItem>
                        <SelectItem value="Jackets">Jackets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-supplier">{t.supplier}</Label>
                    <Input
                      id="edit-supplier"
                      value={editingProduct.supplier}
                      onChange={(e) => setEditingProduct({ ...editingProduct, supplier: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">{t.price}</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })
                      }
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">{t.stock}</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">{t.description}</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleUpdateProduct} className="bg-blue-600 hover:bg-blue-700">
                {t.save}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-white" />
                <CardTitle className="text-white">{t.products}</CardTitle>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">{t.name}</TableHead>
                  <TableHead className="text-gray-300">{t.sku}</TableHead>
                  <TableHead className="text-gray-300">{t.category}</TableHead>
                  <TableHead className="text-gray-300">{t.price}</TableHead>
                  <TableHead className="text-gray-300">{t.stock}</TableHead>
                  <TableHead className="text-gray-300">{t.status}</TableHead>
                  <TableHead className="text-gray-300">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-300">{product.sku}</TableCell>
                    <TableCell className="text-gray-300">{product.category}</TableCell>
                    <TableCell className="text-gray-300">${product.price}</TableCell>
                    <TableCell className="text-gray-300">{product.stock}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-gray-600"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteDialog
                          itemName={product.name}
                          onDelete={() => handleDeleteProduct(product.id)}
                          translations={t}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
