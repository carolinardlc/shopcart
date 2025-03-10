import Container from '@/components/Container';
import Logo from '@/components/Logo';
import React from 'react';
import HeaderMenu from './HeaderMenu';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import FavoriteButton from './FavoriteButton';

const Header = () => {
  return (
    <header className='bg-white py-5 border-b border-b-black/20'>
      <Container className='flex items-center justify-between'>
        <Logo />
      <HeaderMenu />
    <div className='w-auto md:w-1/3 flex
    items-center justify-end gap-5'>
      <SearchBar />
      <CartIcon />
      <FavoriteButton />
    </div>
      </Container>
    </header>
  )
};

export default Header;