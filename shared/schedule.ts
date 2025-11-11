export interface ScheduleItem {
  id: number;
  org: string;
  title: string;
  place: string;
  teacher: string;
  start_time: string;
  end_time: string;
  color: string;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
}
