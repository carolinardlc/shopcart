import { headerData } from '@/constants/data';
import React from 'react'

const HeaderMenu = () => {
  return (
    <div>
      {headerData?.map((item)=>(
        <a key={item?.title} href={item?.href}>
          {item?.title}
        </a>
      ))}
    </div>
  )
}

export default HeaderMenu;