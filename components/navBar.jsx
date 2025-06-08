import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconClickCount, setIconClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState(null);
  const menuRef = useRef();
  const iconRef = useRef();

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMenuOpen(false);
  };

  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      iconRef.current &&
      !iconRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (iconClickCount === 7) {
      router.push('/login');
      clearTimeout(clickTimeout);
      setIconClickCount(0);
    }
  }, [iconClickCount, router, clickTimeout]);

  const handleIconClick = () => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeout = setTimeout(() => setIconClickCount(0), 3000);
    setClickTimeout(timeout);
    setIconClickCount(prev => prev + 1);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <CodeIcon onClick={handleIconClick} />
          <Link href="/" className="logo-link">NavarroJalen</Link>
        </div>
        <MenuIcon ref={iconRef} className="menu-icon" onClick={toggleMenu} />
      </nav>

      <div ref={menuRef} className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/home" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link>

        {user ? (
          <>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Navbar;
