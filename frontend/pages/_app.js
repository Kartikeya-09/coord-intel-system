import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import { AuthProvider } from '../lib/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
