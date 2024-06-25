'use client'

import { useUIStore } from "@/store"
import clsx from "clsx"
import Link from "next/link"
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"


export const Sidebar = () => {

    const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
    const closeMenu = useUIStore((state) => state.closeSideMenu);



  return (
    <div>
        {/* background black */}
        {
            isSideMenuOpen && (
                <div
                    // onClick={closeMenu} 
                    className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-10"
                />
            )
        }
        
        
        {/* blur */}
        {
            isSideMenuOpen && (
                <div
                    onClick={closeMenu}
                    className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" 
                />
            )
        }
        

        {/* side menu */}
        <nav
            className={
                clsx(
                    "fixed p-5 top-0 right-0 w-[400px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSideMenuOpen,
                    }
                )
            }
        >
            <IoCloseOutline
                size={50}
                className="absolute top-5 right-5 cursor-pointer"
                onClick={closeMenu}
            />

            {/* input search */}
            <div className="relative mt-14">
                <IoSearchOutline size={20} className="absolute top-1 left-2" />
                <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full bg-gray-50 rounded pl-10 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* menu */}
            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoPersonOutline size={30} />
                <p className="ml-3 text-xl">Mi Perfil</p>
            </Link>

            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoTicketOutline size={30} />
                <p className="ml-3 text-xl">Ordenes</p>
            </Link>

            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoLogInOutline size={30} />
                <p className="ml-3 text-xl">Ingresar</p>
            </Link>

            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoLogOutOutline size={30} />
                <p className="ml-3 text-xl">Salir</p>
            </Link>

            {/* line separator */}
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoShirtOutline size={30} />
                <p className="ml-3 text-xl">Produtos</p>
            </Link>

            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoTicketOutline size={30} />
                <p className="ml-3 text-xl">Ordenes</p>
            </Link>

            <Link
                href="/"
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
                <IoPeopleOutline size={30} />
                <p className="ml-3 text-xl">Usuarios</p>
            </Link>

        </nav>
    </div>
  )
}
