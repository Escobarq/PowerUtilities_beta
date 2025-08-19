/* eslint react/prop-types: 0 */

/**
 * Display a labeled system stat row.
 * @param {{
 *   label: string | import('react').ReactNode,
 *   value: string | number | import('react').ReactNode,
 * }} props
 */

export default function SystemStat({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-subtitle-logo">{label}</span>
      <span className="font-medium text-accent-gold">{value}</span>
    </div>
  )
}
