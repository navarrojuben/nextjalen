// pages/_app.js

import '../styles/main.scss';
import '../styles/main.css';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserProvider, useUser } from '../context/UserContext';

import Navbar from '../components/navBar';
import SideBar from '../components/sideBar';

// 👇 Viewport Debug (Dev Only)
function ViewportDebug() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      {size.width} x {size.height}
    </div>
  );
}

// 👇 Protected Layout with sidebar and mobile check
function ProtectedLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="protected-layout">
      <SideBar />
      {isMobile ? (
        <div className="useBigScreenDiv">
          USE WIDER SCREEN TO ACCESS THIS SECTION <br />
          (Minimum width: 800px)
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// 👇 Optional wrapper for protected routes
function ProtectedRoute({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  if (!user) return null; // Or show spinner
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

// 👇 Page wrapper
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const protectedRoutes = [
    '/dashboard', '/projects', '/links', '/codes', '/guides', '/inbox', '/notes', '/dates'
  ];

  const isProtected = protectedRoutes.includes(router.pathname);
  const hideNavbarOn = ['/login'];
  const showNavbar = !hideNavbarOn.includes(router.pathname);

  return (
    <UserProvider>
      {showNavbar && <Navbar />}
      {isProtected ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
      <ViewportDebug />
    </UserProvider>
  );
}

export default MyApp;
