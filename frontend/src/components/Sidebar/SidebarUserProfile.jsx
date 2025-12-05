import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronUp, User, LogOut, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import useAuth from '@/hooks/useAuth';
import SimpleAvatar from '../Profile/SimpleAvatar';

export default function SidebarUserProfile() {
  const { logout } = useAuth();
  const { auth } = useAuth();
  const username = auth.user?.name;

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarFooter className="p-2 border-t dark:border-gray-800">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full flex items-center justify-between h-12 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex items-center gap-8">
                  <SimpleAvatar username={username} size={35} />

                  <span>{username}</span>
                </div>
                <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {/* isi dropdown */}
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-[var(--radix-dropdown-menu-trigger-width)]"
            >
              <DropdownMenuItem asChild className="cursor-pointer p-2">
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
