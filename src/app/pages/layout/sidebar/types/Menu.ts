export type Menu = {
    name: string,
    iconClass: string,
    iconUrl:string,
    active: boolean,
    submenu: { name: string, url: string, isActive: boolean }[]
  }
