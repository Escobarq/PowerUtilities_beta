import PropTypes from 'prop-types'

export default function Heading({ children }) {
  return <h1 className="text-2xl font-bold text-gray-100">{children}</h1>
}

Heading.propTypes = {
  children: PropTypes.node
}
