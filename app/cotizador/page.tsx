"use client"

import { Cotizador } from "@/components/cotizador"
import { CotizadorMobile } from "@/components/cotizador-mobile"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { tarifasPrimusGFS, tarifasGlobalGAP } from "@/lib/tarifas"
// Primero, importar la función getExchangeRate
import { getExchangeRate } from "@/lib/exchange-rate"

export default function CotizadorPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen py-4 px-4 relative mt-10 md:mt-0">
      <div className="container mx-auto pt-16 md:pt-20">
        <div className="flex justify-start items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Cotizador de Certificaciones</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Calcule el costo de sus certificaciones PrimusGFS y GLOBALG.A.P.
          </p>
        </div>
        {isMounted && <CotizadorWrapper />}
      </div>
    </div>
  )
}

// Componente wrapper que decide qué versión mostrar
function CotizadorWrapper() {
  const { isMobile } = useMobile()

  if (isMobile) {
    return <CotizadorMobileWrapper />
  }

  return <Cotizador />
}

// Luego, modificar la función CotizadorWrapper para que obtenga el tipo de cambio
function CotizadorMobileWrapper() {
  const [esquemas, setEsquemas] = useState<string[]>([])
  const [datosGenerales, setDatosGenerales] = useState({
    nombreEmpresa: "",
    representanteLegal: "",
    direccionFiscal: "",
    pais: "",
    codigoPostal: "",
    rfc: "",
    correo: "",
    telefono: "",
    personaContacto: "",
    celular: "",
    cargo: "",
    paginaWeb: "",
    redesSociales: "",
  })
  const [datosPrimusGFS, setDatosPrimusGFS] = useState({
    operaciones: [{ tipo: "granja", cantidad: 1, tarifa: tarifasPrimusGFS["granja"] }],
  })
  const [datosGlobalGAP, setDatosGlobalGAP] = useState({
    opcionCertificacion: "opcion1_individual",
    alcances: ["frutas_vegetales"],
    addons: [],
    sitios: [{ tipo: "granja", cantidad: 1, tarifa: tarifasGlobalGAP["granja"] }],
  })
  const [moneda, setMoneda] = useState("USD")
  const [tipoCambio, setTipoCambio] = useState(17.5)
  const [incluirIVA, setIncluirIVA] = useState(true)
  const [tasaIVA, setTasaIVA] = useState(16)
  const [pestanaActiva, setPestanaActiva] = useState("general")
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false)

  // Obtener el tipo de cambio actual cuando se selecciona MXN como moneda
  useEffect(() => {
    if (moneda === "MXN" && !isLoadingExchangeRate) {
      setIsLoadingExchangeRate(true)
      getExchangeRate()
        .then((rate) => {
          setTipoCambio(rate)
        })
        .finally(() => {
          setIsLoadingExchangeRate(false)
        })
    }
  }, [moneda, isLoadingExchangeRate])

  const generarPDF = () => {
    setPestanaActiva("pdf")
  }

  return (
    <CotizadorMobile
      onGenerarPDF={generarPDF}
      datosGenerales={datosGenerales}
      setDatosGenerales={setDatosGenerales}
      datosPrimusGFS={datosPrimusGFS}
      setDatosPrimusGFS={setDatosPrimusGFS}
      datosGlobalGAP={datosGlobalGAP}
      setDatosGlobalGAP={setDatosGlobalGAP}
      esquemas={esquemas}
      setEsquemas={setEsquemas}
      moneda={moneda}
      setMoneda={setMoneda}
      tipoCambio={tipoCambio}
      setTipoCambio={setTipoCambio}
      incluirIVA={incluirIVA}
      setIncluirIVA={setIncluirIVA}
      tasaIVA={tasaIVA}
      setTasaIVA={setTasaIVA}
    />
  )
}
