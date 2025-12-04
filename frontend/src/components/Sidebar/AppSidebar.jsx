import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Settings,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router';
import SidebarUserProfile from './SidebarUserProfile';

export default function AppSidebar() {
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
    { title: 'My Course', icon: BookOpen, url: '/courses' },
    { title: 'Get Course', icon: BookOpen, url: '/classes' },
    { title: 'Schedule', icon: Calendar, url: '/profile' },
    { title: 'Settings', icon: Settings, url: '#' }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Learning Insight</h2>
            <p className="text-xs text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarUserProfile />
    </Sidebar>
  );
}
