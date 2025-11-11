import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { useEffect, useState } from 'react';
import { getUserId } from '@/lib/cookie';
import type { UserInfo } from '@shared/schedule';

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = getUserId();
        const userRes = await fetch(`/api/getuser/${userId}`);
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftSidebar isAdmin={user?.isAdmin || false} />
      
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 p-5 overflow-auto bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600 mb-8">Эта страница находится в разработке.</p>
            <p className="text-sm text-gray-500">Пожалуйста, продолжайте работу с помощью промптов, чтобы заполнить содержимое этой страницы.</p>
          </div>
        </div>
        <RightSidebar user={user} />
      </div>
    </div>
  );
}
