import React from 'react';

const Header: React.FC = () => {
  const logoPath = '/images/Logo.svg';
  console.log('Logo path:', logoPath);

  return (
    <header className="w-full py-4">
        <div className='pl-20'>
          <img
            src={logoPath}
            alt="Logo"
            className="h-50 w-50" // Increased size
          />
        </div>
    </header>
  );
};

export default Header;