import { usePageTitle } from '@/contexts/PageTitleContext';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';

export default function Header() {
  const { toggleSidebar } = useSidebarToggle();
  const { title } = usePageTitle();

  return (
    <header className="flex items-center h-14 border-b px-4">
      <button onClick={toggleSidebar} className="p-2 rounded hover:bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h10M4 18h16" strokeWidth="2" />
        </svg>
      </button>

      <h1 className="ml-4 text-base font-semibold">
        {title || 'AI Learning Insight'}
      </h1>
    </header>
  );
}
