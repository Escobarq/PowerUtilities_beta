import { AppTemplate } from '../components/templates/index'
import { SystemInfo } from '../components/molecules/index'

export const Home = () => {
  return (
    <AppTemplate sidebar={<SystemInfo />}> 
      {/* Contenido principal de la página */}
    </AppTemplate>
  )
}
