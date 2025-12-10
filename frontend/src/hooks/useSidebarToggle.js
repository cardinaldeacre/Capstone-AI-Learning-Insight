import { useSidebar } from '@/components/ui/sidebar';

export function useSidebarToggle() {
  const { toggleSidebar } = useSidebar();
  return { toggleSidebar };
}
