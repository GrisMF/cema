// Utilidad para manejar el almacenamiento del navegador de forma segura
export const browserStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === "undefined") return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
      return false
    }
  },
}
