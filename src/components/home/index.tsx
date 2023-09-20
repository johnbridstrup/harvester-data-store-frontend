import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { homeMenu } from "@/assets/menu";
import SearchHarvester from "./searchharvester";
import { darkThemeClass, imagePath } from "@/utils/utils";

function LandingView() {
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-home-card-theme", theme);
  return (
    <>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <SearchHarvester component="homepage" theme={theme} />
        </div>
      </div>
      <div className="row mb-4">
        {homeMenu.map((item, index) => (
          <Link
            to={item.href}
            key={index}
            className="col-md-4 link-secondary mt-4"
          >
            <div className={`card card-body hover1 ${cardtheme}`}>
              <div className="link-icon-container">
                <img
                  className="menu-icon"
                  src={imagePath(item.icon)}
                  alt={`${item.icon}`}
                />
                <span className="link">{item.name}</span>
              </div>
              <div>{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default LandingView;
