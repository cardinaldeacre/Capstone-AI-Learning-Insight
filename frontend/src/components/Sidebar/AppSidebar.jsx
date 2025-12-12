import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { LayoutDashboard, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import SidebarUserProfile from './SidebarUserProfile';
import logo from '../../assets/logo-white.png'

export default function AppSidebar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isTeacher = user?.role === 'teacher';

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
    { title: 'My Course', icon: BookOpen, url: '/courses' },
    ...(!isTeacher ? [{ title: 'Get Course', icon: BookOpen, url: '/classes' }] : []),
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 p-2 rounded-lg bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <img src={logo} alt="" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Asta Learning Platform</h2>
            <p className="text-xs text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
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
