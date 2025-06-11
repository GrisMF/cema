// Función para obtener el tipo de cambio actual de USD a MXN
export async function getExchangeRate(): Promise<number> {
  try {
    // Usar la API de ExchangeRate para obtener el tipo de cambio actual
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

    if (!response.ok) {
      throw new Error("No se pudo obtener el tipo de cambio")
    }

    const data = await response.json()

    // Verificar si tenemos el tipo de cambio para MXN
    if (data && data.rates && data.rates.MXN) {
      return data.rates.MXN
    } else {
      throw new Error("No se encontró el tipo de cambio para MXN")
    }
  } catch (error) {
    console.error("Error al obtener el tipo de cambio:", error)
    // Devolver un valor predeterminado en caso de error
    return 17.5
  }
}
