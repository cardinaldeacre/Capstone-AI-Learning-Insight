import { Outlet, NavLink } from 'react-router-dom';
import AppSidebar from '@/components/Sidebar/AppSidebar.jsx';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useLayout } from '@/hooks/useLayout';

export default function MainLayout() {
  const { isSidebarVisible } = useLayout();
  const sidebarWidth = '256px';
  const marginClass = isSidebarVisible ? `sm:ml[${sidebarWidth}]` : 'sm:ml-0';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* sidebar */}
      {isSidebarVisible && (
        <div className="hidden sm:block">
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>
      )}

      <main className="flex-1 pt-4">
        {/* main layout */}
        <div
          className={`flex-1 p-8 transition-all duration-300 ease-in-out ${marginClass}`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
