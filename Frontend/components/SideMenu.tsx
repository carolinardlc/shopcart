import { X } from 'lucide-react';
import React, {FC} from "react";
import Link from 'next/link';
import Logo from "./Logo";
import SocialMedia from './SocialMedia';
import { mobileMenuData } from '@/constants/data';
import { usePathname } from 'next/navigation';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: FC<SideBarProps>= ({isOpen, onClose}) => {
    const pathname = usePathname();
  return (
    <div
    className={`fixed inset-y-0 h-screen left-0 z-50 w-full
    bg-black/50 text-white/70 shadow-xl ${
      isOpen ? "translate-x-0":"-translate-x-full"  
    } hoverEffect`}
    >
      <div className="min-w-72 max-w-96 bg-black h-screen
      p-10 border-r border-r-shop_light_green flex flex-col gap-6 overflow-y-auto">
        <div className='flex items-center justify-between gap-5'>
          <Logo className="text-white" spanDesign="group-hover:text-white"/>
          <button onClick={onClose} 
          className='hover:text-shop_light_green hoverEffect'>
            <X />
          </button>
        </div>

        <div className='flex flex-col space-y-3.5
        font-semibold tracking-wide'>
          {mobileMenuData?.map((item)=>(
        <Link href={item?.href} key={item?.title}
        className={`hover:text-shop_light_green hoverEffect ${pathname === item?.href &&
          "text-white"}`}
          onClick={onClose}
          >
          {item?.title}
        </Link>
          ))}
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Acceso Rápido</h3>
          <div className="space-y-2 text-sm">
            <Link href="/auth/login" onClick={onClose} className="block hover:text-shop_light_green hoverEffect">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register" onClick={onClose} className="block hover:text-shop_light_green hoverEffect">
              Registrarse
            </Link>
          </div>
        </div>
        
        <SocialMedia/>
      </div>
    </div>
  );
};

export default SideMenu;