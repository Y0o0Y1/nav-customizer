export interface NavItem {
  id: number | string;
  title: string;
  target?: string;
  url?: string;
  visible?: boolean;
  hidden?: boolean;
  level?: number;
  children?: NavItem[];
}

export interface TrackNavItemRequest {
  id: number | string;
  from: number | null;
  to: number | null;
  parentId?: number | string | null;
} 