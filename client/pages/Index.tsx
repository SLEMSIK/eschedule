import { useEffect, useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { ScheduleView } from '@/components/ScheduleView';
import { getUserId } from '@/lib/cookie';
import type { ScheduleItem, UserInfo } from '@shared/schedule';

export default function Index() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();

        const [userRes, scheduleRes] = await Promise.all([
          fetch(`/api/getuser/${userId}`),
          fetch(`/api/getmyschedule/${userId}/${selectedDate}`)
        ]);

        const userData = await userRes.json();
        const scheduleData = await scheduleRes.json();

        setUser(userData);
        setScheduleItems(scheduleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftSidebar isAdmin={user?.isAdmin || false} />
      
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <ScheduleView scheduleItems={scheduleItems} selectedDate={selectedDate} />
        <RightSidebar
          user={user}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>
    </div>
  );
}
