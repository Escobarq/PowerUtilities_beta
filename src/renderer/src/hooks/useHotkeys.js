import { useState, useCallback, useMemo, useEffect } from 'react'

/**
 * useHotkeys
 * Hook simple y documentado en espaol para gestionar atajos y su flag `enabled`.
 * Mejoras realizadas:
 * - Evita sobreescribir los atajos persistidos en el main antes de cargarlos (race condition).
 * - Persiste un objeto { hotkeys, enabled } en el proceso principal.
 * - API clara y mas accesible para nuevos desarrolladores.
 *
 * Entradas:
 * - initial: { hotkeys?, enabled? } (opcional) valores por defecto locales
 *
 * Salidas / contratos:
 * - hotkeys: objeto { key: accelerator }
 * - enabled: objeto { key: boolean }
 * - setHotkey(key, accel): actualiza solo la combinacin para `key`
 * - toggleEnabled(key, value?): actualiza o alterna el flag
 * - reset(newDefaults?): resetea a valores por defecto/locales
 */
export default function useHotkeys(initial = {}) {
  const defaults = useMemo(
    () => ({
      shortcuts: 'SUPER + K',
      windows: 'SUPER + W',
      palette: 'SUPER + C',
      capture: 'PRINT',
      search: 'SUPER + SPACE',
      monitor: 'SUPER + M',
      ...(initial.hotkeys || {})
    }),
    [initial.hotkeys]
  )

  const defaultEnabled = useMemo(
    () => ({
      shortcuts: true,
      windows: true,
      palette: false,
      capture: false,
      search: true,
      monitor: false,
      ...(initial.enabled || {})
    }),
    [initial.enabled]
  )

  const [hotkeys, setHotkeys] = useState(defaults)
  const [enabled, setEnabled] = useState(defaultEnabled)

  // Flag para saber si ya cargamos los valores desde el proceso principal.
  // Evita que la primera renderizacion persista los `defaults` y sobrescriba la store.
  const [remoteLoaded, setRemoteLoaded] = useState(false)

  // Cargar valores persistidos (si existe la API hotkeys en preload)
  useEffect(() => {
    let mounted = true
    if (
      typeof window !== 'undefined' &&
      window.hotkeys &&
      typeof window.hotkeys.get === 'function'
    ) {
      window.hotkeys
        .get()
        .then((remote) => {
          if (!mounted) return
          // Aceptamos dos formatos para compatibilidad:
          // 1) { hotkeys: { ... }, enabled: { ... } }
          // 2) legacy: raw map of hotkeys (backwards compatibility)
          if (remote && typeof remote === 'object') {
            if (remote.hotkeys && typeof remote.hotkeys === 'object') {
              setHotkeys((h) => ({ ...h, ...remote.hotkeys }))
            } else if (Object.keys(remote).length) {
              // legacy: treat remote as hotkeys map
              setHotkeys((h) => ({ ...h, ...remote }))
            }
            if (remote.enabled && typeof remote.enabled === 'object') {
              setEnabled((e) => ({ ...e, ...remote.enabled }))
            }
          }
          setRemoteLoaded(true)
        })
        .catch(() => {
          // Si falla la llamada, no persistimos hasta que el usuario cambie algo
          setRemoteLoaded(true)
        })
    } else {
      // No hay API: marcar como cargado para permitir persistencia local si existe
      setRemoteLoaded(true)
    }

    return () => {
      mounted = false
    }
  }, [])

  const setHotkey = useCallback((key, value) => {
    setHotkeys((h) => ({ ...h, [key]: value }))
  }, [])

  const toggleEnabled = useCallback((key, value) => {
    if (typeof value === 'boolean') {
      setEnabled((e) => ({ ...e, [key]: value }))
    } else {
      setEnabled((e) => ({ ...e, [key]: !e[key] }))
    }
  }, [])

  // Persistir hotkeys + enabled en el proceso principal, pero solo DESPUES
  // de haber cargado los valores remotos para evitar sobrescrituras.
  useEffect(() => {
    if (!remoteLoaded) return
    if (
      typeof window !== 'undefined' &&
      window.hotkeys &&
      typeof window.hotkeys.set === 'function'
    ) {
      // Guardamos un objeto { hotkeys, enabled } para ser mas explícitos.
      window.hotkeys.set({ hotkeys, enabled }).catch(() => {})
    }
  }, [hotkeys, enabled, remoteLoaded])

  const reset = useCallback(
    (newDefaults = {}) => {
      setHotkeys(() => ({ ...defaults, ...(newDefaults.hotkeys || {}) }))
      setEnabled(() => ({ ...defaultEnabled, ...(newDefaults.enabled || {}) }))
    },
    [defaults, defaultEnabled]
  )

  return {
    hotkeys,
    enabled,
    setHotkey,
    toggleEnabled,
    reset
  }
}
