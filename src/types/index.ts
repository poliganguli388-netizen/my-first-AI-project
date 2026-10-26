export type EventType = 'wedding' | 'birthday' | 'anniversary' | 'corporate' | 'community' | 'party' | 'other';

export interface BudgetRow {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  text: string;
  weeks: number;
  done: boolean;
  category?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  event: string;
  lead: string;
  location?: string;
}

export type VendorStatus = 'To Contact' | 'Quoted' | 'Booked' | 'Paid';

export interface VendorItem {
  id: string;
  name: string;
  cat: string;
  quote: number;
  status: VendorStatus;
  note?: string;
  phone?: string;
  email?: string;
}

export type RsvpStatus = 'Confirmed' | 'Pending' | 'Declined';
export type DietType = 'Veg' | 'Non-Veg' | 'Jain' | 'Vegan' | 'Halal' | 'Gluten-Free' | 'Any';

export interface GuestItem {
  id: string;
  name: string;
  count: number;
  rsvp: RsvpStatus;
  diet: DietType;
  notes?: string;
  table?: string;
  contact?: string;
}

export type IdeaTag = 'Decor' | 'Food' | 'Activity' | 'Gift' | 'Music' | 'Tech' | 'Theme';

export interface IdeaItem {
  id: string;
  title: string;
  tag: IdeaTag;
  detail: string;
}

export interface EventState {
  theme: 'light' | 'dark';
  name: string;
  type: EventType;
  date: string;
  guests: number;
  budget: number;
  currency: string;
  city: string;
  notes: string;
  activeTab: 'budget' | 'timeline' | 'schedule' | 'vendors' | 'guests' | 'ideas';
  budgetRows: BudgetRow[];
  tasks: TaskItem[];
  schedule: ScheduleItem[];
  vendors: VendorItem[];
  guestList: GuestItem[];
  ideas: IdeaItem[];
}
