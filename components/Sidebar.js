import { useState, useEffect } from 'react';
import { ListGroup, Button, Row } from 'react-bootstrap';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { FiCrosshair } from 'react-icons/fi';
import { MdCancelPresentation } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setUser } from '@/redux/slices/authSlice';
import { endpoint } from '@/utils/factory';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Close sidebar when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false); // Close the sidebar when route changes
    };

    // Listen to route changes
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup event listener on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${endpoint?.baseUrl}/api/auth/logout`, {
        token: user?.accessToken
      });

      dispatch(setUser({
              user: null,
              accessToken: null,
              refreshToken: null,
            }));
        
            // Redirect to dashboard
            router.push('/login');
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to logout. Please try again.',
      });
      console.error('Logout error:', error);
      
    }
  };

  return (
    <>
    <Row className='flex justify-content-between align-items-center px-4' style={{ height: '60px', background: 'linear-gradient(135deg, #43cea2, #185a9d)', color: 'white' }}>
      {user && (
      <Button
        variant="light"
        onClick={toggleSidebar}
        style={{
          zIndex: 100,
          background: 'none',
          border: 'none',
          width: '50px',
          color: 'white',
        }}
      >
        {!open ? <MenuIcon /> : <MdCancelPresentation size={25} />}
      </Button>
      )}
      <h5 className='p-0 m-0' style={{width: 'auto'}}>ALM SPORTS</h5>
    </Row>
      <div
        style={{
          width: open ? '100%' : 0,
          height: '100%',
          background: 'linear-gradient(135deg, #43cea2, #185a9d)',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          transition: '0.3s',
          paddingTop: '60px',
          fontSize: '3em',
          textAlign: 'center',
          zIndex: 99,
        }}
      >
        <ListGroup className="mt-5 fs-1">
          <ListGroup.Item className="mt-3" style={{background: 'none'}}>
            <Link style={{ textDecoration: 'none', color: '#fff' }} href="/">
              Dashboard
            </Link>
          </ListGroup.Item>
          <ListGroup.Item className="mt-3" style={{background: 'none'}}>
            <Link style={{ textDecoration: 'none', color: '#fff' }} href="/collections">
              Collections
            </Link>
          </ListGroup.Item>
          <ListGroup.Item className="mt-3" style={{background: 'none'}}>
            <Link style={{ textDecoration: 'none', color: '#fff' }} href="/catalogues">
              Catalogues
            </Link>
          </ListGroup.Item>
          <ListGroup.Item className="mt-3" style={{background: 'none'}}>
            <Link style={{ textDecoration: 'none', color: '#fff' }} href="/Products">
              Products
            </Link>
          </ListGroup.Item>
          <ListGroup.Item onClick={() => handleLogout()} className="p-4" style={{background: 'none', position: 'absolute', bottom: 0, width: '100%'}}>
            <p style={{ textDecoration: 'none', color: '#fff' }} >
              Logout
            </p>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </>
  );
}
