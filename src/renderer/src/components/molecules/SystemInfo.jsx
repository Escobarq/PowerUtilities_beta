/* eslint react/prop-types: 0 */
import { SystemStat } from '../atoms/index'

/**
 * System information panel.
 * @param {{
 *   value?: {
 *     sistema?: string,
 *     herramientas?: string,
 *     cpu?: string,
 *     ram?: string,
 *   }
 * }} props
 */
export default function SystemInfo({
  value = {
    sistema: 'Ubuntu 24.04',
    herramientas: '2 de 6',
    cpu: '12%',
    ram: '3.2 GB'
  }
}) {
  return (
    <div className="bg-border gap-y-20 rounded-md p-5 space-y-2">
      <SystemStat label="SISTEMA" value={value.sistema} />
      <SystemStat label="UTILIDADES ACTIVAS" value={value.herramientas} />
      <SystemStat label="CPU" value={value.cpu} />
      <SystemStat label="RAM" value={value.ram} />
    </div>
  )
}
