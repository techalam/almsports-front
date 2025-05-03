"use client"
import App from 'next/app';
import '@/styles/globals.css'
import { Provider, useSelector } from 'react-redux'
import { store, persistor } from '@/redux/store'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { PersistGate } from 'redux-persist/integration/react'

function AuthGuard({ children }) {  
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const isLoginPage = router.pathname === '/login' || router.pathname === '/productDetails' || router.pathname === '/viewCatalogue' || router.pathname === '/viewCatalogue';

  // Wait for rehydration to complete before continuing
  const isHydrated = useSelector((state) => state._persist?.rehydrated);

  useEffect(() => {
    console.log("isLoginPage", isLoginPage);
    
    if (!user && !isLoginPage) {
      router.push('/login');
    }
    else if (user && router.pathname === '/login') {
      router.push('/');
    }
  }, [user, isLoginPage, router, isHydrated]);

  // if (!isHydrated) return <div>Loading...</div>;  // Show loading until rehydration is done

  return children;
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showSidebar = router.pathname !== '/login';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthGuard>
          {showSidebar && <Sidebar />}
          <div style={{ padding: '20px 10px' }}>
            <Component {...pageProps} />
          </div>
        </AuthGuard>
      </PersistGate>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};
