import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../functions/function.ts'; // Import the function file
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
