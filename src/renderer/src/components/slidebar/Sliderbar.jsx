

export default function Slidebar({ open, setOpen }) {
  return (
    <div
      className={`bg-[#2a2a23] transition-all duration-300 overflow-hidden text-[#bfa783] ${
        open ? "w-64 border-r border-[#947c64]" : "w-0"
      }`}
    >
      {open && (
        <div className="flex flex-col justify-between">
            <button
                onClick={() => setOpen(false)}
                className="border-b border-[#947c64] flex px-4 py-4 mb-2"
            >
                Cerrar
            </button>
            <ul className="space-y-4">
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Inicio</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Proyectos</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Servicios</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Contacto</li>
            </ul>
        </div>
      )}
    </div>
  );
}

