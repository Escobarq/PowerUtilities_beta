import { useState, useEffect } from 'react'
import { AppTemplate } from '../components/templates/index'
import { SystemInfo, FeatureCard } from '../components/molecules/index'
import { FaKeyboard, FaWindowMaximize, FaPalette, FaCamera, FaSearch, FaBolt } from 'react-icons/fa'
import useHotkeys from '../hooks/useHotkeys'
import useCaptureHotkey from '../hooks/useCaptureHotkey'

export const Home = () => {
  // Nota: useHotkeys mantiene defaults locales y persiste via preload.
  // Cargamos la store remota explícitamente al montar para que el flujo sea
  // evidente a nuevos desarrolladores.
  const { hotkeys, enabled, setHotkey, toggleEnabled } = useHotkeys()

  useEffect(() => {
    let unsub = null
    // Si existe la API de preload, obtener la estructura completa.
    if (typeof window !== 'undefined' && window.hotkeys && window.hotkeys.get) {
      // Llamada demostrativa para dejar claro dónde se cargan los datos
      // persistidos. useHotkeys ya realiza la carga interna; esta llamada
      // se deja por claridad para nuevos contribuidores.
      window.hotkeys.get().catch(() => {})
    }

    // Suscribirse a eventos cuando el main notifique que un atajo fue disparado
    if (typeof window !== 'undefined' && window.hotkeys && window.hotkeys.onTriggered) {
      unsub = window.hotkeys.onTriggered((key) => {
        // Ejemplo para nuevos devs: aquí reaccionamos a un atajo global
        console.log('Atajo global disparado:', key)
        // Podríamos abrir la paleta si key === 'palette', etc.
      })
    }

    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const [editingKey, setEditingKey] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const { accel, clear } = useCaptureHotkey(Boolean(editingKey))

  // sincronizar accel al abrir/actualizar
  useEffect(() => {
    if (accel) setEditingValue(accel)
  }, [accel])

  const openEdit = (key) => {
    setEditingKey(key)
    setEditingValue(hotkeys[key] || '')
  }

  const closeEdit = () => {
    setEditingKey(null)
    setEditingValue('')
  }

  const saveEdit = () => {
    if (editingKey) setHotkey(editingKey, editingValue)
    clear()
    closeEdit()
  }

  return (
    <AppTemplate sidebar={<SystemInfo />}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          Centro de Control
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Gestor de Atajos"
            subtitle="Sistema de atajos globales"
            icon={<FaKeyboard />}
            description={
              'Configura y administra atajos de teclado personalizados para aplicaciones y comandos del sistema.'
            }
            hotkey={hotkeys.shortcuts}
            enabled={enabled.shortcuts}
            onToggleEnabled={(v) => toggleEnabled('shortcuts', v)}
            onEditHotkey={() => openEdit('shortcuts')}
          />

          <FeatureCard
            title="Administrador de Ventanas"
            subtitle="Control avanzado de ventanas"
            icon={<FaWindowMaximize />}
            description={
              'Organiza, redimensiona y administra ventanas con gestos y atajos avanzados.'
            }
            hotkey={hotkeys.windows}
            enabled={enabled.windows}
            onToggleEnabled={(v) => toggleEnabled('windows', v)}
            onEditHotkey={() => openEdit('windows')}
          />

          <FeatureCard
            title="Selector de Color"
            subtitle="Captura colores de pantalla"
            icon={<FaPalette />}
            description={'Extrae y copia códigos de color (HEX, RGB, HSL) y mantiene un historial.'}
            hotkey={hotkeys.palette}
            enabled={enabled.palette}
            onToggleEnabled={(v) => toggleEnabled('palette', v)}
            onEditHotkey={() => openEdit('palette')}
          />

          <FeatureCard
            title="Capturador"
            subtitle="Screenshots avanzados"
            icon={<FaCamera />}
            description={
              'Toma capturas de pantalla con opciones de área personalizada, retardo y editor básico.'
            }
            hotkey={hotkeys.capture}
            enabled={enabled.capture}
            onToggleEnabled={(v) => toggleEnabled('capture', v)}
            onEditHotkey={() => openEdit('capture')}
          />

          <FeatureCard
            title="PowerSearch"
            subtitle="Búsqueda rápida universal"
            icon={<FaSearch />}
            description={
              'Busca archivos, aplicaciones y contenido en todo el sistema con filtros avanzados.'
            }
            hotkey={hotkeys.search}
            enabled={enabled.search}
            onToggleEnabled={(v) => toggleEnabled('search', v)}
            onEditHotkey={() => openEdit('search')}
          />

          <FeatureCard
            title="Monitor del Sistema"
            subtitle="Rendimiento en tiempo real"
            icon={<FaBolt />}
            description={
              'Supervisa CPU, memoria, red y almacenamiento con gráficos en tiempo real.'
            }
            hotkey={hotkeys.monitor}
            enabled={enabled.monitor}
            onToggleEnabled={(v) => toggleEnabled('monitor', v)}
            onEditHotkey={() => openEdit('monitor')}
          />
        </div>
        {/* Edit modal */}
        {editingKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
            <div className="relative bg-[var(--color-accent)] border border-[var(--color-border)] rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                Editar atajo
              </h2>
              <label className="block text-sm text-[var(--color-text-muted)] mb-2">
                Combinación
              </label>
              <input
                className="w-full p-2 rounded border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] mb-4"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                placeholder="Ej: SUPER + K"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)]"
                  onClick={closeEdit}
                >
                  Cancelar
                </button>
                <button
                  className="px-3 py-1 rounded bg-[var(--color-accent-gold)] text-[var(--color-primary)]"
                  onClick={saveEdit}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppTemplate>
  )
}
