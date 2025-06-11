"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getAllDiscountCodes, createDiscountCode, updateDiscountCode, deleteDiscountCode } from "@/lib/discount-service"
import type { DiscountCode } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdminDiscountCodes() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCode, setCurrentCode] = useState<DiscountCode | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercentage: 10,
    validUntil: "",
    maxUses: "",
    isActive: true,
  })

  useEffect(() => {
    loadDiscountCodes()
  }, [])

  const loadDiscountCodes = () => {
    const codes = getAllDiscountCodes()
    setDiscountCodes(codes)
  }

  const handleAddNew = () => {
    setFormData({
      code: "",
      description: "",
      discountPercentage: 10,
      validUntil: "",
      maxUses: "",
      isActive: true,
    })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (code: DiscountCode) => {
    setCurrentCode(code)
    setFormData({
      code: code.code,
      description: code.description,
      discountPercentage: code.discountPercentage,
      validUntil: code.validUntil ? new Date(code.validUntil).toISOString().split("T")[0] : "",
      maxUses: code.maxUses !== null ? code.maxUses.toString() : "",
      isActive: code.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (code: DiscountCode) => {
    setCurrentCode(code)
    setIsDeleteDialogOpen(true)
  }

  const handleAddSubmit = () => {
    try {
      createDiscountCode({
        code: formData.code,
        description: formData.description,
        discountPercentage: formData.discountPercentage,
        validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
        maxUses: formData.maxUses ? Number.parseInt(formData.maxUses) : null,
        isActive: formData.isActive,
      })
      setIsAddDialogOpen(false)
      loadDiscountCodes()
    } catch (error) {
      alert(`Error al crear código de descuento: ${(error as Error).message}`)
    }
  }

  const handleEditSubmit = () => {
    if (!currentCode) return

    try {
      updateDiscountCode(currentCode.id, {
        code: formData.code,
        description: formData.description,
        discountPercentage: formData.discountPercentage,
        validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
        maxUses: formData.maxUses ? Number.parseInt(formData.maxUses) : null,
        isActive: formData.isActive,
      })
      setIsEditDialogOpen(false)
      loadDiscountCodes()
    } catch (error) {
      alert(`Error al actualizar código de descuento: ${(error as Error).message}`)
    }
  }

  const handleDeleteConfirm = () => {
    if (!currentCode) return

    try {
      deleteDiscountCode(currentCode.id)
      setIsDeleteDialogOpen(false)
      loadDiscountCodes()
    } catch (error) {
      alert(`Error al eliminar código de descuento: ${(error as Error).message}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number.parseFloat(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Códigos de Descuento</CardTitle>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Código
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Válido Hasta</TableHead>
              <TableHead>Usos Máx.</TableHead>
              <TableHead>Usos Actuales</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>{code.description}</TableCell>
                <TableCell>{code.discountPercentage}%</TableCell>
                <TableCell>{code.validUntil ? new Date(code.validUntil).toLocaleDateString() : "Sin límite"}</TableCell>
                <TableCell>{code.maxUses !== null ? code.maxUses : "Sin límite"}</TableCell>
                <TableCell>{code.currentUses}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${code.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {code.isActive ? "Activo" : "Inactivo"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(code)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(code)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {discountCodes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No hay códigos de descuento disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Diálogo para añadir nuevo código */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Código de Descuento</DialogTitle>
              <DialogDescription>Completa el formulario para crear un nuevo código de descuento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Código
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountPercentage" className="text-right">
                  Descuento (%)
                </Label>
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="validUntil" className="text-right">
                  Válido Hasta
                </Label>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxUses" className="text-right">
                  Usos Máximos
                </Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Activo
                </Label>
                <div className="col-span-3">
                  <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSubmit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar código */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Código de Descuento</DialogTitle>
              <DialogDescription>Modifica los detalles del código de descuento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">
                  Código
                </Label>
                <Input
                  id="edit-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-discountPercentage" className="text-right">
                  Descuento (%)
                </Label>
                <Input
                  id="edit-discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-validUntil" className="text-right">
                  Válido Hasta
                </Label>
                <Input
                  id="edit-validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-maxUses" className="text-right">
                  Usos Máximos
                </Label>
                <Input
                  id="edit-maxUses"
                  name="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  Activo
                </Label>
                <div className="col-span-3">
                  <Switch id="edit-isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSubmit}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para confirmar eliminación */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el código de descuento "{currentCode?.code}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
