import PropTypes from 'prop-types'

export default function Subheading({ children }) {
  return <p className="text-sm text-gray-400">{children}</p>
}

Subheading.propTypes = {
  children: PropTypes.node
}
