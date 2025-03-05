import { cn } from '@/lib/utils'
import React from 'react'

const Logo = ({className}:{className?:string}) => {
  return (
    <a href={"/"}>
      <h2 className={cn('text-2xl text-shop_dark_green font-black tracking-wider uppercase hover:text-shop_light_green hoverEffect group font-sans', className)}
      >
        Shopcar<span className='text-shop_light_green group-hover:text-shop_dark_green hoverEffect'>t</span></h2>
    </a>  
  )
}

export default Logo