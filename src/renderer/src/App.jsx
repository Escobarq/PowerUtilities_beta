import './styles/App.css'
import { Home } from './pages/Home'

function App() {
  const [open, setOpen] = useState(false); // 👈 aquí defines el estado

  return (
    <>
      <Home />
    </>
  )
}

export default App;
