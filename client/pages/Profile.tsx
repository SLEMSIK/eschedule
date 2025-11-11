import { useEffect, useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { getUserId } from '@/lib/cookie';
import type { UserInfo } from '@shared/schedule';

export default function Profile() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = getUserId();
        const userRes = await fetch(`/api/getuser/${userId}`);
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'E';

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftSidebar isAdmin={user?.isAdmin || false} />
      
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 p-5 overflow-auto bg-white">
          <div className="flex flex-col gap-8 max-w-4xl">
            <h1 className="text-[26px] font-bold">Профиль</h1>

            <div className="bg-white rounded-lg border border-[#E4E4E4] p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-[#5272E9] rounded-full flex items-center justify-center text-white text-4xl font-medium">
                    {userInitial}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold text-black">{user?.name || 'Пользователь'}</h2>
                    <div className="text-sm text-[#A6A6A6]">eSchedule</div>
                  </div>
                </div>

                <div className="border-t border-[#E4E4E4] pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-[#A6A6A6]">ID пользователя</div>
                      <div className="text-base font-medium text-black">{user?.id || '—'}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-[#A6A6A6]">Имя</div>
                      <div className="text-base font-medium text-black">{user?.name || '—'}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-[#A6A6A6]">Роль</div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-black">
                          {user?.isAdmin ? 'Администратор' : 'Пользователь'}
                        </span>
                        {user?.isAdmin && (
                          <span className="px-2 py-1 text-xs font-medium bg-[#514DF7] text-white rounded-md">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-[#A6A6A6]">Статус</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-base font-medium text-black">Активен</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E4E4E4] p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Дополнительная информация</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#5272E9"/>
                    <path d="M10 12C5.58172 12 2 13.7909 2 16V18H18V16C18 13.7909 14.4183 12 10 12Z" fill="#5272E9"/>
                  </svg>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-black">Профиль пользователя</div>
                    <div className="text-xs text-[#A6A6A6]">Управление личными данными</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RightSidebar
          user={user}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>
    </div>
  );
}

