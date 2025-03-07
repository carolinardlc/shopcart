"use client";
import { headerData } from '@/constants/data';
import { usePathname } from 'next/navigation';
import React from 'react'

const HeaderMenu = () => {
    const pathname=usePathname()

    return (
    <div className='hidden md:inline-flex w-1/3 items-center gap-7 text-sm capitalize font-semibold text-lightColor'>
      {headerData?.map((item)=>(
        <a 
        key={item?.title}
        href={item?.href} 
        className={`hover:text-shop_light_green 
        hoverEffect relative group ${
          pathname === item?.href &&
          "text-shop_light_green"}`}
        >
          {item?.title}
          <span
          className={`absolute -bottom-0.5 left-1/2
            w-0 h-0.5 bg-shop_light_green
            group-hover:w-1/2 hoverEffect group-hover:left-0 ${
              pathname === item?.href &&
              "text-shop_light_green"}`}
            />
          <span className={`absolute -bottom-0.5 right-1/2
            w-0 h-0.5 bg-shop_light_green
            group-hover:w-1/2 hoverEffect
            group-hover:right-0 ${
              pathname === item?.href &&
              "text-shop_light_green"}`}/>
        </a>
      ))}
    </div>
  )
}

export default HeaderMenu;