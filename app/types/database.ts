export interface Cotizacion {
  id: string
  created_at: string
  user_id: string | null
  fecha: string
  datos_generales: any // JSONB
  esquemas: any // JSONB
  datos_primusgfs: any | null // JSONB
  datos_globalgap: any | null // JSONB
  moneda: string
  tipo_cambio: number
  incluir_iva: boolean
  tasa_iva: number
  subtotal: number
  descuento_porcentaje: number | null
  descuento_monto: number | null
  iva: number
  total: number
  estado: string | null
  documento_url: string | null
  orden_servicio_url: string | null
  motivo_rechazo: string | null
  updated_at: string | null
  // Relación con usuarios
  users?: {
    name: string | null
    email: string | null
  } | null
}

export interface Usuario {
  id: string
  created_at: string
  name: string | null
  email: string | null
  // Agregar otros campos según tu tabla users
}
