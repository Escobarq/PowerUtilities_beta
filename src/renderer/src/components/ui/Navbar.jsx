import { PanelsTopLeft, PanelRightOpen } from 'lucide-react';

const menuList = [
    { menu: 'inicio', href: '#'},
    { menu: 'settings', href: '#'},
]

export default function Navbar({open, setOpen}) {
    return (
        <div className="text-lg">
            <nav className="flex justify-between border-b border-[#947c64] px-4 py-4 ">
                <div className="flex gap-4">
                    <button
                        onClick={() => setOpen(!open)}
                        className={`${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    >
                        <PanelsTopLeft />
                    </button>

                    <h1>Power Utility</h1>
                </div>
                <div className="flex gap-4">
                    {menuList.map((item) => (
                        <a key={item} href={item.href}>{item.menu}</a>
                    ))}
                </div>
            </nav>
        </div>
    )
}