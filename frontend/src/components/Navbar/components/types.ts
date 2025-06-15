export interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
  onClick?: () => void;
}

export interface User {
  name: string;
  image?: string;
}
