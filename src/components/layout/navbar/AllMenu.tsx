import { ChangeEvent, useState } from "react";
import { menu, adminMenu } from "@/assets/menu";
import AllMenuItem from "./AllMenuItem";
import SearchHarvester from "@/components/home/searchharvester";
import { darkThemeClass } from "@/utils/utils";

interface User {
  is_superuser: boolean;
}

interface MenuProps {
  user?: User | null;
  theme: string | null;
}

interface MenuItem {
  name: string;
  icon: string;
  description: string;
  href: string;
}

function AllMenu(props: MenuProps) {
  const menus = props.user?.is_superuser ? adminMenu : menu;
  const [searched, setSearched] = useState<MenuItem[]>(menus);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let filtered = value
      ? menus.filter((x: MenuItem) =>
          x.name.toLowerCase().includes(value.toLowerCase()),
        )
      : menus;
    setSearched(filtered);
  };
  const allmenu = darkThemeClass("dt-all-menu", props.theme);
  const allleft = darkThemeClass("dt-all-left", props.theme);
  const icontheme = darkThemeClass("dt-icon-dark", props.theme);

  return (
    <div className={`all-menu ${allmenu}`}>
      <div className="all-menu-header">Menu</div>
      <div className="all-menu-wrap scrollbar">
        <div className={`all-left ${allleft}`}>
          <div className="all-menu-search">
            <i className={`las la-search ${icontheme}`}></i>
            <input
              type="text"
              name="search"
              placeholder="Search Menu"
              onChange={handleChange}
            />
          </div>
          <div className="all-menu-group">
            <SearchHarvester component="navbar" theme={props.theme} />
          </div>
          <div className="all-menu-group">
            <div className="all-menu-group-header">HDS</div>
            {searched.map((item, index) => (
              <AllMenuItem
                key={index}
                name={item.name}
                description={item.description}
                icon={item.icon}
                href={item.href}
                theme={props.theme}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllMenu;
