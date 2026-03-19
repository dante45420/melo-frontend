import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="page-frame">
        <main className="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
