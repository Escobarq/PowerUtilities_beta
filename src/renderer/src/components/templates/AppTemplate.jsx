import PropTypes from 'prop-types'
import Sidebar from '../organisms/Sidebar'
import Topbar from '../organisms/Topbar'

export default function AppTemplate({ sidebar, children }) {
  return (
    <div className="flex h-screen">
      <Sidebar>{sidebar}</Sidebar>
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-5 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

AppTemplate.propTypes = {
  sidebar: PropTypes.node,
  children: PropTypes.node
}
