import { Heading, Subheading } from '../atoms/index'

export default function PageHeader() {
  return (
    <div className="space-y-1">
      <Heading>Centro de Control</Heading>
      <Subheading>Administra y configura las herramientas del sistema</Subheading>
    </div>
  )
}