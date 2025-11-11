import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserInfo } from '@shared/schedule';

interface RightSidebarProps {
  user: UserInfo | null;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function RightSidebar({ user, selectedDate, onSelectDate }: RightSidebarProps) {
  const isActive = (path: string) => location.pathname === path;
  const monthNamesRu = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

  // Displayed month/year is decoupled from selection; initialize from selectedDate
  const init = useMemo(() => {
    const m = selectedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const y = m ? parseInt(m[1], 10) : new Date().getFullYear();
    const mi = m ? parseInt(m[2], 10) - 1 : new Date().getMonth();
    return { y, mi };
  }, [selectedDate]);
  const [displayedYear, setDisplayedYear] = useState(init.y);
  const [displayedMonthIndex, setDisplayedMonthIndex] = useState(init.mi); // 0-based
  const month = (displayedMonthIndex + 1).toString().padStart(2, '0');

  const [menuOpen, setMenuOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuHeight, setMenuHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      if (menuRef.current) {
        setMenuHeight(menuRef.current.scrollHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [menuOpen]);


  const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'E';
  const selectedParts = selectedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const selectedY = selectedParts ? parseInt(selectedParts[1], 10) : null;
  const selectedM = selectedParts ? parseInt(selectedParts[2], 10) - 1 : null;
  const selectedDay = selectedParts ? parseInt(selectedParts[3], 10) : null;

  const toIso = (day: number) =>
    `${displayedYear}-${month}-${day.toString().padStart(2, '0')}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = (year: number, mi: number) => new Date(year, mi + 1, 0).getDate();
  const firstDayOfMonth = (year: number, mi: number) => new Date(year, mi, 1).getDay(); // 0=Sun..6=Sat
  const mondayIndex = (dow: number) => (dow + 6) % 7; // convert to Mon=0..Sun=6
  const calendarDays = useMemo(() => {
    const dim = daysInMonth(displayedYear, displayedMonthIndex);
    const startDow = mondayIndex(firstDayOfMonth(displayedYear, displayedMonthIndex));
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }, [displayedYear, displayedMonthIndex]);

  const isSelectedInView = (day: number) =>
    selectedY === displayedYear && selectedM === displayedMonthIndex && selectedDay === day;

  const isPast = (day: number) => {
    const d = new Date(displayedYear, displayedMonthIndex, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const prevMonth = () => {
    if (displayedMonthIndex === 0) {
      setDisplayedMonthIndex(11);
      setDisplayedYear(displayedYear - 1);
    } else {
      setDisplayedMonthIndex(displayedMonthIndex - 1);
    }
  };
  const nextMonth = () => {
    if (displayedMonthIndex === 11) {
      setDisplayedMonthIndex(0);
      setDisplayedYear(displayedYear + 1);
    } else {
      setDisplayedMonthIndex(displayedMonthIndex + 1);
    }
  };

  return (
    <div className="w-full lg:w-[380px] flex flex-col gap-8 p-5 bg-gray-50">
      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-lg border border-[#E4E4E4] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-[#5272E9] rounded-full flex items-center justify-center text-white text-2xl font-medium">
                {userInitial}
              </div>
              <div>
                <div className="text-base font-medium text-black">{user?.name || 'Пользователь'}</div>
                <div className="text-xs font-medium text-[#A6A6A6]">eSchedule</div>
              </div>
            </div>
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none" className="cursor-pointer transition-transform" onClick={() => setMenuOpen((v) => !v)} style={{ transform: menuOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              <path d="M8.99507 9.94672L0.26528 1.88948C-0.0884267 1.56801 -0.0884267 1.04819 0.26528 0.726725L0.799604 0.241101C1.15331 -0.0803671 1.72526 -0.0803671 2.07897 0.241101L9.63475 7.23817L17.1905 0.247942C17.5442 -0.073527 18.1162 -0.073527 18.4699 0.247942L19.0042 0.733564C19.3579 1.05503 19.3579 1.57485 19.0042 1.89632L10.2744 9.95356C9.92073 10.2682 9.34878 10.2682 8.99507 9.94672Z" fill="#5272E9"/>
            </svg>
          </div>

          <div
            className="mt-4 overflow-hidden"
            style={{
              maxHeight: menuOpen ? menuHeight : 0,
              opacity: menuOpen ? 1 : 0,
              transition: 'max-height 300ms ease, opacity 300ms ease'
            }}
          >
            <div ref={menuRef} className="flex flex-col gap-2">
            <Link to="/" className={`flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
            isActive('/') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
          }`}>
              <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                <path d="M11.7472 4.53816C12.8281 3.82062 14.1719 3.82061 15.2528 4.53815L21.1154 8.28599C21.1269 8.29333 21.1383 8.30093 21.1494 8.30877C22.2068 9.05079 23 10.2589 23 11.7303V19.7473C23 21.549 21.556 23 19.753 23H17.5C16.6716 23 16 22.3284 16 21.5V18.5C16 17.6716 15.3284 17 14.5 17H12.5C11.6716 17 11 17.6716 11 18.5V21.5C11 22.3284 10.3284 23 9.5 23H7.24701C5.44399 23 4 21.549 4 19.7473V11.7303C4 10.3991 4.66259 9.06575 5.88533 8.28551L11.7472 4.53816Z" fill="currentColor"/>
              </svg>
              <span className="text-[13px]">Главная</span>
            </Link>

            <Link
          to="/profile"
          className={`flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg transition-colors ${
            isActive('/profile') ? 'bg-[#514DF7] text-white' : 'text-black hover:bg-gray-100'
          }`}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.5 8C4.5 5.37479 4.52811 4.5 8 4.5C11.4719 4.5 11.5 5.37479 11.5 8C11.5 10.6252 11.5111 11.5 8 11.5C4.48893 11.5 4.5 10.6252 4.5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M15.5 8C15.5 5.37479 15.5281 4.5 19 4.5C22.4719 4.5 22.5 5.37479 22.5 8C22.5 10.6252 22.5111 11.5 19 11.5C15.4889 11.5 15.5 10.6252 15.5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M4.5 19C4.5 16.3748 4.52811 15.5 8 15.5C11.4719 15.5 11.5 16.3748 11.5 19C11.5 21.6252 11.5111 22.5 8 22.5C4.48893 22.5 4.5 21.6252 4.5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M15.5 19C15.5 16.3748 15.5281 15.5 19 15.5C22.4719 15.5 22.5 16.3748 22.5 19C22.5 21.6252 22.5111 22.5 19 22.5C15.4889 22.5 15.5 21.6252 15.5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={`text-[13px] font-normal transition-opacity duration-300`}>Профиль</span>
            </Link>

            {user?.isAdmin && (
              <button className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-black w-full">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                  <circle cx="17.5" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M22.056 15.398L21.6276 14.8982C20.595 13.6934 19.0875 13 17.5007 13C15.9136 13 14.4058 13.6935 13.373 14.8985L12.9446 15.3984C12.3353 16.1093 12.0004 17.0146 12.0003 17.9509C12.0001 19.0824 12.9174 19.9998 14.0489 19.9998H20.9517C22.083 19.9998 23.0002 19.0827 23.0003 17.9514C23.0005 17.0148 22.6655 16.1091 22.056 15.398Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="text-[13px]">Администрирование</span>
              </button>
            )}
            
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E4E4E4]">
          <div className="p-4 flex items-center justify-between border-b border-[#E4E4E4]">
            <svg width="12" height="31" viewBox="0 0 12 31" fill="none" className="cursor-pointer" onClick={prevMonth}>
              <path d="M0.255679 14.9854L9.19542 6.02442C9.48164 5.73985 9.94446 5.73985 10.2307 6.02442L11.4364 7.22324C11.7227 7.50782 11.7227 7.96797 11.4364 8.25254L4.2201 15.5L11.4364 22.7475C11.7227 23.032 11.7227 23.4922 11.4364 23.7768L10.2307 24.9756C9.94446 25.2602 9.48164 25.2602 9.19542 24.9756L0.255679 16.0146C-0.0305388 15.7301 -0.0305388 15.2699 0.255679 14.9854Z" fill="#5272E9"/>
            </svg>
            <div className="text-base font-semibold">{monthNamesRu[displayedMonthIndex]} {displayedYear}</div>
            <svg width="12" height="31" viewBox="0 0 12 31" fill="none" className="cursor-pointer" onClick={nextMonth}>
              <path d="M11.4367 16.0146L2.49696 24.9756C2.21074 25.2602 1.74792 25.2602 1.46171 24.9756L0.255937 23.7768C-0.0302812 23.4922 -0.0302813 23.032 0.255937 22.7475L7.47228 15.5L0.255936 8.25254C-0.0302825 7.96797 -0.0302826 7.50782 0.255936 7.22325L1.4617 6.02442C1.74792 5.73985 2.21074 5.73985 2.49696 6.02442L11.4367 14.9854C11.7229 15.2699 11.7229 15.7301 11.4367 16.0146Z" fill="#5272E9"/>
            </svg>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {daysOfWeek.map((day) => (
                <div key={day} className="h-11 flex items-center justify-center text-[13px] font-medium text-[#7A7A7A]">
                  {day}
                </div>
              ))}
            </div>

            {calendarDays.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 gap-1.5 mb-1.5">
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`h-11 flex items-center justify-center rounded-md text-[11px] font-medium cursor-pointer ${
                      day === null
                        ? ''
                        : isSelectedInView(day)
                        ? 'bg-[#5272E9] text-white'
                        : isPast(day)
                        ? 'bg-white text-[#A6A6A6]'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                    onClick={() => day && onSelectDate(toIso(day))}
                  >
                    {day}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}
