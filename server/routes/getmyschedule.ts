import { RequestHandler } from "express";
import { ScheduleItem } from "@shared/schedule";

export const handleGetMySchedule: RequestHandler = (req, res) => {
  const { id, date } = req.params;

  // Simple mock switcher: vary schedule by day-of-month parsed from YYYY-MM-DD
  const day = (() => {
    if (!date) return null;
    const match = date.match(/^\d{4}-\d{2}-(\d{2})$/);
    if (!match) return null;
    return parseInt(match[1], 10);
  })();

  const base: ScheduleItem[] = [
    {
      id: 1,
      org: "Организация 1",
      title: "Занятие №1",
      place: "Спортивный зал №2",
      teacher: "Константинопольский К. К.",
      start_time: "18:00",
      end_time: "20:00",
      color: "#5272E9"
    },
    {
      id: 2,
      org: "Организация 1",
      title: "Занятие №2",
      place: "Спортивный зал №2",
      teacher: "Константинопольский К. К.",
      start_time: "11:30",
      end_time: "12:50",
      color: "#5272E9"
    }
  ];

  const altA: ScheduleItem[] = [
    {
      id: 3,
      org: "Организация 2",
      title: "Йога",
      place: "Зал 1",
      teacher: "Иванова И. И.",
      start_time: "09:00",
      end_time: "10:00",
      color: "#24B0C9"
    },
    {
      id: 4,
      org: "Организация 3",
      title: "Силовая тренировка",
      place: "Зал 3",
      teacher: "Петров П. П.",
      start_time: "19:00",
      end_time: "21:00",
      color: "#EA4B4B"
    },
    {
      id: 10,
      org: "Организация 2",
      title: "Йога",
      place: "Зал 1",
      teacher: "Иванова И. И.",
      start_time: "19:00",
      end_time: "20:00",
      color: "#24B0C9"
    },
    {
      id: 11,
      org: "Организация 2",
      title: "Йога",
      place: "Зал 1",
      teacher: "Иванова И. И.",
      start_time: "16:00",
      end_time: "17:00",
      color: "#24B0C9"
    },
  ];

  const altB: ScheduleItem[] = [
    {
      id: 5,
      org: "Организация 4",
      title: "Плавание",
      place: "Бассейн",
      teacher: "Сергеев С. С.",
      start_time: "07:30",
      end_time: "08:30",
      color: "#39C07B"
    }
  ];

  let result: ScheduleItem[];
  if (day === null) {
    result = base;
  } else if (day % 3 === 0) {
    result = altA;
  } else if (day % 2 === 0) {
    result = base;
  } else {
    result = altB;
  }

  res.json(result);
};
