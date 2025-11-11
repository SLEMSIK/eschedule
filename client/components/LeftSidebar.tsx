import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface LeftSidebarProps {
  isAdmin: boolean;
}
export function LeftSidebar({ isAdmin }: LeftSidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${collapsed ? 'w-[76px]' : 'w-[250px]'} transition-all duration-300 h-screen bg-white flex flex-col p-5 gap-5 border-r border-[#E4E4E4] hidden lg:flex`}>
      <div className={`flex items-center justify-center gap-2.5 p-2.5 ${collapsed ? 'flex items-center justify-center gap-0 p-0' : ''}`}>
      <img
              src="/white-pyramid-with-background-fotor-2025021721438 1.png"
              alt="eSchedule Logo"
              className={`w-16 h-16 object-contain transition-all duration-300 ${collapsed ? 'hidden' : ''}`}
            />
        <div className={`text-[20px] font-medium text-center leading-[19px] transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>
          eSchedule
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        <Link
          to="/"
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
            isActive('/') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
          }`}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path d="M11.7472 4.53816C12.8281 3.82062 14.1719 3.82061 15.2528 4.53815L21.1154 8.28599C21.1269 8.29333 21.1383 8.30093 21.1494 8.30877C22.2068 9.05079 23 10.2589 23 11.7303V19.7473C23 21.549 21.556 23 19.753 23H17.5C16.6716 23 16 22.3284 16 21.5V18.5C16 17.6716 15.3284 17 14.5 17H12.5C11.6716 17 11 17.6716 11 18.5V21.5C11 22.3284 10.3284 23 9.5 23H7.24701C5.44399 23 4 21.549 4 19.7473V11.7303C4 10.3991 4.66259 9.06575 5.88533 8.28551L11.7472 4.53816Z" fill="currentColor"/>
          </svg>
          <span className={`text-[13px] font-normal transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>Расписание</span>
        </Link>

        <Link
          to="/disciplines"
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
            isActive('/disciplines') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
          }`}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path d="M6.95425 12.7877L12.9801 16.2456C13.3004 16.4294 13.6996 16.4294 14.0199 16.2456L20.5464 12.5005M6.95425 12.7877L3.24781 10.6609C2.9174 10.4713 2.9174 10.0105 3.24781 9.82093L12.9801 4.23623C13.3004 4.05244 13.6996 4.05244 14.0199 4.23623L23.7522 9.82093C24.0826 10.0105 24.0826 10.4713 23.7522 10.6609L20.5464 12.5005M6.95425 12.7877L6.95415 18.7944C6.95415 19.1289 7.13172 19.4402 7.42488 19.6196L12.4495 22.695C13.0941 23.0896 13.914 23.1025 14.5717 22.7286L20.0471 19.6153C20.3565 19.4394 20.5463 19.1192 20.5463 18.7733L20.5464 12.5005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={`text-[13px] font-normal transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>Дисциплины</span>
        </Link>

        <Link
          to="/groups"
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
            isActive('/groups') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
          }`}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <circle cx="17.5" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8.5" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M22.056 15.398L21.6276 14.8982C20.595 13.6934 19.0875 13 17.5007 13C15.9136 13 14.4058 13.6935 13.373 14.8985L12.9446 15.3984C12.3353 16.1093 12.0004 17.0146 12.0003 17.9509C12.0001 19.0824 12.9174 19.9998 14.0489 19.9998H20.9517C22.083 19.9998 23.0002 19.0827 23.0003 17.9514C23.0005 17.0148 22.6655 16.1091 22.056 15.398Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className={`text-[13px] font-normal transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>Группы</span>
        </Link>

        <Link
          to="/teachers"
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
            isActive('/teachers') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
          }`}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path d="M7 21.2429C7 19.0367 9.97503 17 13.5 17C17.006 17 20 19.0169 20 21.2231" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 6.75C15.5707 6.75 17.2497 8.42899 17.25 10.5C17.25 12.571 15.571 14.25 13.5 14.25H13.4717C11.4091 14.243 9.74301 12.5656 9.75 10.5029V10.5C9.75025 8.42935 11.4294 6.75026 13.5 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="13.5" cy="13.5" r="10.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className={`text-[13px] font-normal transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>Преподаватели</span>
        </Link>
      </div>

      <div className="flex flex-col justify-center gap-0">
        {isAdmin && (
          <Link
            to="/admin"
            className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
              isActive('/admin') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
            }`}
          >
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
              <circle cx="17.5" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8.5" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M22.056 15.398L21.6276 14.8982C20.595 13.6934 19.0875 13 17.5007 13C15.9136 13 14.4058 13.6935 13.373 14.8985L12.9446 15.3984C12.3353 16.1093 12.0004 17.0146 12.0003 17.9509C12.0001 19.0824 12.9174 19.9998 14.0489 19.9998H20.9517C22.083 19.9998 23.0002 19.0827 23.0003 17.9514C23.0005 17.0148 22.6655 16.1091 22.056 15.398Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className={`text-[13px] font-normal transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>Администрирование</span>
          </Link>
        )}

        <Link
          to="/report-bug"
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-1.5 px-1.5 py-1.5 rounded-lg text-black hover:bg-gray-100`}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path d="M7.3125 7.31055C10.7257 3.89604 16.2722 3.89629 19.6855 7.31055V7.31152C22.3586 9.98403 22.9397 13.9452 21.4395 17.1875L21.4238 17.2227C21.3332 17.448 21.3359 17.7015 21.3398 17.8408C21.3448 18.0176 21.3647 18.2213 21.3887 18.4268C21.4129 18.6345 21.4434 18.8652 21.4746 19.0977C21.5062 19.3329 21.5384 19.574 21.5664 19.8154C21.6233 20.3059 21.6593 20.7624 21.6436 21.126C21.6357 21.307 21.6153 21.4392 21.5908 21.5283C21.5855 21.5479 21.5785 21.5625 21.5742 21.5742C21.5625 21.5785 21.5479 21.5855 21.5283 21.5908C21.4392 21.6153 21.307 21.6357 21.126 21.6436C20.7624 21.6593 20.3059 21.6233 19.8154 21.5664C19.574 21.5384 19.3329 21.5062 19.0977 21.4746C18.8651 21.4434 18.6345 21.4128 18.4268 21.3887C18.2215 21.3648 18.0184 21.3448 17.8418 21.3398C17.7025 21.3359 17.4482 21.334 17.2227 21.4248L17.1885 21.4395C14.0469 22.8924 10.232 22.3936 7.56738 19.9307L7.3125 19.6865L7.00293 19.3604C3.90195 15.9282 3.99917 10.6248 7.3125 7.31152V7.31055Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 9.5V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 17.45V17.5499" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={`text-[13px] font-normal transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>Сообщить об ошибке</span>
        </Link>
        
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={`mt-2 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-black`}
        >
          {!collapsed && <span className="text-[13px]">Скрыть меню</span>}
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.75" y="0.75" width="19.5" height="19.5" rx="3.75" stroke="black" strokeWidth="1.5"/>
            <path d="M15 13L12 10.5L15 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 1V20" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
