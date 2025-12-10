import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Sidebar/AppSidebar';
// import Header from '@/components/Header';
import Header from '@/components/Sidebar/Header';

export default function MainLayout() {
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '260px',
        '--header-height': '56px'
      }}
    >
      <AppSidebar />

      <SidebarInset>
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
