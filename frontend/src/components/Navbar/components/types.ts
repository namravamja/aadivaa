export interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
}

export interface User {
  name: string;
  image?: string;
}