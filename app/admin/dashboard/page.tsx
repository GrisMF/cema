"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "@/hooks/use-toast"
import AddUserForm from "./add-user-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type User = {
  id: string
  email: string
  name: string | null
  role: string
  is_superuser: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        setUsers(data as User[])
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al cargar usuarios: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function toggleUserRole(userId: string, currentRole: string) {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"

      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId)

      if (error) {
        throw error
      }

      // Actualizar la lista de usuarios
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "Rol actualizado",
        description: `El usuario ahora es ${newRole === "admin" ? "administrador" : "usuario regular"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar rol: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  async function deleteUser(userId: string) {
    try {
      // Primero verificamos que no sea el último administrador
      const admins = users.filter((user) => user.role === "admin")
      const userToDelete = users.find((user) => user.id === userId)

      if (admins.length === 1 && userToDelete?.role === "admin") {
        toast({
          title: "Acción no permitida",
          description: "No se puede eliminar el último administrador del sistema",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) {
        throw error
      }

      // Actualizar la lista de usuarios
      setUsers(users.filter((user) => user.id !== userId))

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al eliminar usuario: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <Tabs defaultValue="users" className="mb-8">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="add">Añadir Usuario</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra los usuarios del sistema, cambia roles y permisos</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <Button onClick={fetchUsers} variant="outline" size="sm">
                      Actualizar lista
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Fecha de creación</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No hay usuarios registrados
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name || "Sin nombre"}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                                  {user.role === "admin" ? "Administrador" : "Usuario"}
                                </Badge>
                                {user.is_superuser && (
                                  <Badge variant="secondary" className="ml-2">
                                    Superusuario
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  onClick={() => toggleUserRole(user.id, user.role)}
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                >
                                  {user.role === "admin" ? "Hacer Usuario" : "Hacer Admin"}
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      Eliminar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteUser(user.id)}>
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <AddUserForm onUserAdded={fetchUsers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
