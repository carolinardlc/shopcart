'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useCart } from '@/contexts/CartContext';

const CartIcon = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Link href={"/cart"} className='group relative'>
        <ShoppingBag className="w-5 h-5
        hover:text-shop_light_green hoverEffect"/>
        {totalItems > 0 && (
          <span className='absolute -top-1 -right-1
          bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full 
          text-xs font-semibold flex items-center justify-center'>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
    </Link>
  )
}

export default CartIcon;