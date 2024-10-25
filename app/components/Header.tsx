import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  const logoPath = '/images/Logo.svg';

  return (
    <header className="w-full py-4">
        <div className='pl-20'>
          <a href="/">
          <Image
            src={logoPath}
            alt="Logo"
            width={120}  
            height={120} 
          />
          </a>
        </div>
    </header>
  );
};

export default Header;