import PropTypes from 'prop-types'
import { Logo } from '../atoms/index'

export default function Sidebar({ children }) {
  return (
    <aside className="bg-accent w-72 flex flex-col justify-between h-screen border-r border-neutral-800">
      <div className="px-4 py-32 flex flex-col items-center justify-center">
        <div className="px-4">
          <Logo />
        </div>
      </div>
      <div className="p-5 flex-1 overflow-auto">{children}</div>
    </aside>
  )
}

Sidebar.propTypes = {
  children: PropTypes.node
}
