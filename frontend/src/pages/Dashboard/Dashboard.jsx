import SectionCard from '../../components/Dashboard/SectionCard';
import HeaderCard from '../../components/Dashboard/HeaderCard';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { useEffect } from 'react';
import StatisticCard from '@/components/Dashboard/StatisticCard';
import MyCourseCard from '@/components/Dashboard/MyCourseCard';

export default function Dashboard() {
  const { setTitle } = usePageTitle();
  const user = JSON.parse(localStorage.getItem('user'));
  const isTeacher = user?.role === 'teacher';
  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 border border-gray-300 rounded-2xl p-3">
        <div className="flex flex-col gap-4s md:gap-6 ">
          <h1>Dashboard</h1>
          {!isTeacher ? (
            <>
              <HeaderCard />
              <SectionCard />
            </>
          ) : (
            <>
              <StatisticCard />
              <MyCourseCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
