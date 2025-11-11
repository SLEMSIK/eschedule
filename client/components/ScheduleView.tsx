import { ScheduleItem } from '@shared/schedule';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getUserId } from '@/lib/cookie';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface ScheduleViewProps {
  scheduleItems: ScheduleItem[];
  selectedDate: string;
}

export function ScheduleView({ scheduleItems, selectedDate }: ScheduleViewProps) {
  const monthNamesRuGenitive = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const titleDate = (() => {
    const m = selectedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return selectedDate;
    const y = parseInt(m[1], 10);
    const mi = parseInt(m[2], 10) - 1;
    const d = parseInt(m[3], 10);
    return `${d} ${monthNamesRuGenitive[mi]} ${y}`;
  })();
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestSubject, setRequestSubject] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const timeToPixels = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const startHour = 7;
    const pixelsPerHour = 72;
    return ((hours - startHour) * 60 + minutes) * (pixelsPerHour / 60);
  };

  const getDuration = (start: string, end: string): number => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
  };

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof document === 'undefined') {
      setRequestError('Среда недоступна для отправки заявки.');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setRequestError('Не удалось определить ID пользователя.');
      return;
    }

    setIsSubmittingRequest(true);
    setRequestError(null);
    setRequestSuccess(false);

    try {
      const response = await fetch(`/api/newrequest/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: requestSubject.trim(),
          details: requestDetails.trim(),
        }),
      });

      if (!response.ok) {
        let message = 'Не удалось отправить заявку. Попробуйте ещё раз.';
        try {
          const data = await response.json();
          if (typeof data?.message === 'string') {
            message = data.message;
          }
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      setRequestSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
      }, 1200);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось отправить заявку. Попробуйте ещё раз.';
      setRequestError(message);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  useEffect(() => {
    if (!isRequestModalOpen) {
      setRequestSubject('');
      setRequestDetails('');
      setRequestError(null);
      setRequestSuccess(false);
      setIsSubmittingRequest(false);
    }
  }, [isRequestModalOpen]);

  const scheduledItems = useMemo(() => {
    // Prepare items with time in minutes for overlap detection
    const itemsWithTimes = scheduleItems.map((item) => {
      const [sh, sm] = item.start_time.split(':').map(Number);
      const [eh, em] = item.end_time.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      return { item, startMin, endMin };
    }).sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

    // Sweep line to assign columns to overlapping items
    type ActiveEntry = { endMin: number; col: number };
    const active: ActiveEntry[] = [];
    const assigned: Array<{ base: typeof scheduleItems[number]; top: number; height: number; col: number }> = [];

    const takeSmallestFreeCol = (usedCols: Set<number>): number => {
      let c = 0;
      while (usedCols.has(c)) c++;
      return c;
    };

    for (const entry of itemsWithTimes) {
      // Remove finished from active
      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].endMin <= entry.startMin) {
          active.splice(i, 1);
        }
      }
      // Determine used columns among active overlaps
      const used = new Set<number>(active.map(a => a.col));
      const col = takeSmallestFreeCol(used);

      // Push current into active
      active.push({ endMin: entry.endMin, col });

      // Visual metrics
      const top = timeToPixels(entry.item.start_time)+20;
      const duration = getDuration(entry.item.start_time, entry.item.end_time);
      const pixelsPerHour = 72;
      const heightP = (duration / 60) * pixelsPerHour;
      let height = 114
      if(heightP > 114){
        height = heightP+20
      }else{
        height = 114
      }
      assigned.push({
        base: entry.item,
        top,
        height,
        col,
      });
    }

    // Map back to renderable items
    return assigned.map(a => ({
      ...a.base,
      top: a.top,
      height: a.height,
      col: a.col,
    }));
  }, [scheduleItems]);

  const getTextColor = (bgColor: string): string => {
    return bgColor;
  };

  return (
    <div className="flex-1 p-5 overflow-auto bg-white">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-[26px] font-bold">Моё расписание</h1>

          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">{titleDate}</div>
            <div className="flex items-center gap-3">
              

              <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                <DialogTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-[#5272E9] text-white flex items-center gap-3 text-xs">
                    <svg width="13" height="13" viewBox="0 0 17 17" fill="none">
                      <path d="M16.6458 9.5625H9.5625V16.6458C9.5625 16.8415 9.40401 17 9.20833 17H7.79167C7.59599 17 7.4375 16.8415 7.4375 16.6458V9.5625H0.354167C0.15849 9.5625 0 9.40401 0 9.20833V7.79167C0 7.59599 0.15849 7.4375 0.354167 7.4375H7.4375V0.354167C7.4375 0.15849 7.59599 0 7.79167 0H9.20833C9.40401 0 9.5625 0.15849 9.5625 0.354167V7.4375H16.6458C16.8415 7.4375 17 7.59599 17 7.79167V9.20833C17 9.40401 16.8415 9.5625 16.6458 9.5625Z" fill="white"/>
                    </svg>
                    Оправить заявку
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Отправка заявки</DialogTitle>
                    <DialogDescription>
                      Заполните форму, чтобы отправить заявку. Мы свяжемся с вами после обработки.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="requestSubject" className="text-sm font-medium text-gray-700">
                        Тема
                      </label>
                      <input
                        id="requestSubject"
                        type="text"
                        value={requestSubject}
                        onChange={(event) => setRequestSubject(event.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#5272E9] focus:outline-none focus:ring-2 focus:ring-[#5272E9]/20"
                        placeholder="Например: Запрос на изменение расписания"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="requestDetails" className="text-sm font-medium text-gray-700">
                        Сообщение
                      </label>
                      <textarea
                        id="requestDetails"
                        value={requestDetails}
                        onChange={(event) => setRequestDetails(event.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#5272E9] focus:outline-none focus:ring-2 focus:ring-[#5272E9]/20"
                        placeholder="Опишите, что необходимо сделать..."
                        rows={4}
                        required
                      />
                    </div>
                    {requestError && (
                      <p className="text-sm text-red-500">
                        {requestError}
                      </p>
                    )}
                    {requestSuccess && (
                      <p className="text-sm text-green-600">
                        Заявка успешно отправлена.
                      </p>
                    )}
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          Отмена
                        </button>
                      </DialogClose>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-[#5272E9] text-white text-sm transition hover:bg-[#415AD0] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={
                          isSubmittingRequest ||
                          !requestSubject.trim() ||
                          !requestDetails.trim()
                        }
                      >
                        {isSubmittingRequest ? 'Отправка...' : 'Отправить'}
                      </button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          

          <div className="grid grid-cols-[53px_1fr] gap-6 relative">
            <div className="flex flex-col">
              {timeSlots.map((time) => (
                <div key={time} className="text-base text-[#B1B1B1] text-center h-[72px] flex items-center justify-center">
                  {time}
                </div>
              ))}
            </div>

            <div className="relative min-h-[800px]">
              

              <div className="relative">
                {scheduledItems.map((item, index) => {
                  const bgColor = item.color;
                  const textColor = getTextColor(bgColor);
                  const lightBg = `${bgColor}15`;

                  return (
                    <div
                      key={item.id}
                      className="absolute rounded-md overflow-hidden shadow-sm"
                      style={{
                        top: `${item.top}px`,
                        left: `${(item as any).col * 220}px`,
                        width: '200px',
                        height: `${item.height}px`
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[7px]"
                        style={{ backgroundColor: bgColor }}
                      />
                      <div
                        className="absolute left-[7px] right-0 top-0 bottom-0 rounded-r-md p-5 flex flex-col justify-between"
                        style={{ backgroundColor: lightBg }}
                      >
                        <div>
                          <div
                            className="text-xs font-medium mb-1"
                            style={{ color: textColor }}
                          >
                            {item.title}
                          </div>
                          <div
                            className="text-[11px] mb-0.5"
                            style={{ color: textColor }}
                          >
                            {item.place}
                          </div>
                          <div
                            className="text-[11px]"
                            style={{ color: textColor }}
                          >
                            {item.teacher}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
                            <path d="M6.80312 0C3.04494 0 0 2.82647 0 6.315C0 9.80353 3.04494 12.63 6.80312 12.63C10.5613 12.63 13.6062 9.80353 13.6062 6.315C13.6062 2.82647 10.5613 0 6.80312 0ZM12.7284 6.315C12.7284 9.33754 10.0922 11.8152 6.80312 11.8152C3.54695 11.8152 0.877821 9.3681 0.877821 6.315C0.877821 3.29246 3.51403 0.814839 6.80312 0.814839C10.0593 0.814839 12.7284 3.2619 12.7284 6.315ZM8.6438 8.56345L6.41633 7.06109C6.33129 7.00252 6.28191 6.91085 6.28191 6.81409V2.75008C6.28191 2.58202 6.43004 2.44452 6.61109 2.44452H6.99514C7.17619 2.44452 7.32432 2.58202 7.32432 2.75008V6.47542L9.25827 7.78171C9.4064 7.88102 9.43658 8.072 9.32959 8.2095L9.10465 8.49724C8.99767 8.6322 8.79193 8.66275 8.6438 8.56345V8.56345Z" fill={bgColor}/>
                          </svg>
                          <div
                            className="text-[10px]"
                            style={{ color: textColor }}
                          >
                            {item.start_time} - {item.end_time}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
