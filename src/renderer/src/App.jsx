import { useState } from "react";
import "./App.css";

// components
import Navbar from "./components/ui/Navbar";
import Slidebar from "./components/slidebar/Sliderbar"; // asegúrate que el archivo se llama Slidebar.jsx

function App() {
  const [open, setOpen] = useState(false); // 👈 aquí defines el estado

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Slidebar open={open} setOpen={setOpen} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Navbar open={open} setOpen={setOpen} />
        <main className="p-6">
          <h1 className="text-xl text-red-800">Contenido aca!</h1>
        </main>
      </div>
    </div>
  );
}

export default App;
