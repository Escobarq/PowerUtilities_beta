import { useState, useEffect, useCallback } from 'react'

const normalizeKey = (key) => {
  if (key === ' ') return 'Space'
  if (key.startsWith('Arrow')) return key.replace('Arrow', '')
  // normalizar a mayúscula si es una letra
  if (key.length === 1) return key.toUpperCase()
  return key
}

/**
 * useCaptureHotkey(active)
 * Cuando `active` es true, escucha keydown y construye una cadena tipo "Ctrl+Shift+K"
 * Retorna { accel, clear }
 */
export default function useCaptureHotkey(active) {
  const [accel, setAccel] = useState('')

  const handler = useCallback((e) => {
    e.preventDefault()
    const parts = []
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey) parts.push('Shift')
    if (e.metaKey) parts.push('Super')
    const k = normalizeKey(e.key)
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(k)) {
      parts.push(k)
      setAccel(parts.join('+'))
    }
  }, [])

  useEffect(() => {
    if (!active) return
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, handler])

  const clear = useCallback(() => setAccel(''), [])

  return { accel, clear }
}
