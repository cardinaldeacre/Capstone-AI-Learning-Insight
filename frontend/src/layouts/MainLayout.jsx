import { Outlet, NavLink } from 'react-router-dom';
import AppSidebar from '@/components/Sidebar/AppSidebar.jsx';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* sidebar */}
      <div className="hidden sm:block">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </div>

      <main className="flex-1 pt-4">
        {/* main layout */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
