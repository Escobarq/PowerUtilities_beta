import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

/**
 * FeatureCard
 * Tarjeta reutilizable para mostrar una funcionalidad/módulo con un toggle y detalles desplegables.
 *
 * Props (documentadas en español):
 * @param {object} props
 * @param {string} props.title - Título de la tarjeta
 * @param {string} [props.subtitle] - Subtítulo corto
 * @param {React.ReactNode} [props.icon] - Icono mostrado a la izquierda
 * @param {string} [props.description] - Descripción corta que aparece dentro del panel desplegable
 * @param {string} [props.hotkey] - Combinación de teclas actual (ej. 'SUPER + K')
 * @param {boolean} [props.enabled=false] - Estado inicial de habilitado. Si quieres controlar externamente el estado, pasa también `onToggleEnabled`.
 * @param {(newValue:boolean) => void} [props.onToggleEnabled] - Callback opcional llamado con el nuevo booleano cuando el usuario cambia el interruptor. Si se proporciona, la tarjeta se comporta en modo controlado (controlled component).
 * @param {() => void} [props.onEditHotkey] - Callback opcional invocado cuando el usuario pulsa 'Editar' para cambiar el atajo.
 * @param {boolean} [props.defaultOpen=false] - Estado inicial abierto del panel de detalles
 * @param {string} [props.className] - Clase CSS adicional
 *
 * Comportamiento de control de estado:
 * - Si se pasan BOTH `enabled` y `onToggleEnabled`, la tarjeta actúa como controlada y reflejará cambios externos vía la prop `enabled`.
 * - Si no se pasan, la tarjeta mantiene su propio estado interno (aislado), por lo que cambiar una tarjeta no afectará a las demás.
 */
export default function FeatureCard({
  title,
  subtitle,
  icon,
  children,
  description,
  hotkey,
  enabled = false,
  onToggleEnabled,
  onEditHotkey,
  defaultOpen = false,
  className = ''
}) {
  const [open, setOpen] = useState(defaultOpen)

  // Determina si el componente se usa en modo controlado
  const isControlled = typeof onToggleEnabled === 'function' && enabled !== undefined

  // Estado interno solo si NO es controlado
  const [isEnabled, setIsEnabled] = useState(enabled)

  // Si es controlado, sincroniza el estado interno con la prop `enabled`
  useEffect(() => {
    if (isControlled) setIsEnabled(enabled)
    // Si no es controlado, NO sobrescribimos el estado local para evitar que
    // cambios externos sincronizados (por ejemplo un objeto compartido) provoquen
    // que todas las tarjetas cambien al mismo tiempo.
  }, [isControlled, enabled])

  return (
    <section
      className={`w-full bg-[var(--color-accent)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm ${className}`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[var(--color-logo)] text-[var(--color-primary)]">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
            {subtitle ? <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Enable toggle (single visual switch) */}
          <button
            role="switch"
            aria-checked={isEnabled}
            onClick={() => {
              const next = !isEnabled
              if (isControlled) {
                // En modo controlado delegamos al callback externo
                onToggleEnabled(next)
              } else {
                // En modo no controlado manejamos el estado localmente (aislado)
                setIsEnabled(next)
              }
            }}
            className={`w-12 h-6 rounded-full relative transition-colors ${isEnabled ? 'bg-[var(--color-accent-gold)]' : 'bg-[var(--color-accent-gold-dark)]'}`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-[var(--color-logo)] absolute top-0.5 left-0.5 transition-transform`}
              style={{ transform: isEnabled ? 'translateX(1.2rem)' : 'translateX(0)' }}
            />
          </button>

          {/* Chevron to expand/collapse details - visually distinct from the switch */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            aria-label={open ? 'Cerrar detalles' : 'Abrir detalles'}
          >
            {open ? '▾' : '▸'}
          </button>
        </div>
      </header>

      <div
        className={`mt-4 transition-all ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        {description && <p className="text-[var(--color-text-muted)]">{description}</p>}

        {/* Hotkey row shown when expanded */}
        {open && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 rounded bg-[var(--color-accent)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm">
                {hotkey || 'Sin atajo'}
              </span>
              <button
                onClick={() => {
                  if (typeof onEditHotkey === 'function') onEditHotkey()
                }}
                className="text-sm px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-primary)]"
              >
                Editar
              </button>
            </div>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node,
  description: PropTypes.string,
  /** Hotkey string shown when expanded (e.g. 'SUPER + K') */
  hotkey: PropTypes.string,
  /** Controlled enabled flag */
  enabled: PropTypes.bool,
  /** Called with new boolean when the enable switch is toggled */
  onToggleEnabled: PropTypes.func,
  /** Called when user wants to edit the hotkey (e.g. open a modal or prompt) */
  onEditHotkey: PropTypes.func,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string
}
