import { Link } from "react-router-dom";
import { darkThemeClass } from "@/utils/utils";
import Avatar from "@/assets/images/avatar.png";

interface User {
  first_name: string;
  last_name: string;
}

interface UserMenuProps {
  theme: string | null;
  user?: User | null;
  logout: () => void;
}

function UserMenu(props: UserMenuProps) {
  const darktheme = darkThemeClass("dt-theme-mode", props.theme);
  const whitecolor = darkThemeClass("dt-link-color", props.theme);
  const darkbg = darkThemeClass("dt-small-circle", props.theme);
  return (
    <div className={`user-menu ${darktheme}`}>
      <div>
        <Link to="/users/profile/me" className="user-menu-header hover3">
          <img src={Avatar} alt="" />
          <div className="menu-col">
            <span className={`${whitecolor}`}>
              {props.user?.first_name} {props.user?.last_name}
            </span>
            <span>See your profile</span>
          </div>
        </Link>
        <div className="menu-splitter"></div>
        <div className="menu-main hover3">
          <div className={`small-circle ${darkbg}`}>
            <i className="las la-comments"></i>
          </div>
          <a
            href="https://github.com/AdvancedFarm/hds-frontend/issues/new"
            target="_blank"
            rel="noreferrer"
            className="menu-col"
          >
            <div className={`menu-span1 ${whitecolor}`}>Give feedback</div>
            <div className="menu-span2">Help us improve HDS</div>
          </a>
        </div>
        <div className="menu-splitter"></div>
        <div className="menu-item hover3" onClick={props.logout}>
          <div className={`small-circle ${darkbg}`}>
            <i className="las la-sign-out-alt"></i>
          </div>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
