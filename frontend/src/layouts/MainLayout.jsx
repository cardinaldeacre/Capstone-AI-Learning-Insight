import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Sidebar/AppSidebar';
import Header from '@/components/Sidebar/Header';
import { LayoutContext } from '@/contexts/LayoutContext';
import { useContext } from 'react';

export default function MainLayout() {
  const { isSidebarVisible } = useContext(LayoutContext);

  const sidebarWidth = isSidebarVisible ? '260px' : '0px';
  const sidebarDisplay = isSidebarVisible ? 'block' : 'none';

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': sidebarWidth, // <-- Terapkan lebar yang dinamis
        '--header-height': '56px'
      }}
    >
      {isSidebarVisible && <AppSidebar />}

      <SidebarInset>
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
