import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { homeMenu } from "@/assets/menu";
import SearchHarvester from "./searchharvester";
import { imagePath } from "@/utils/utils";
import MyJob from "./myjobs";

function LandingView() {
  const { theme } = useAppSelector((state) => state.home);

  return (
    <>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <SearchHarvester component="homepage" theme={theme} />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="row mb-4">
            {homeMenu.map((item, index) => (
              <div key={index} className={`col-md-4 mt-4`}>
                <div className="custom-card">
                  <div className="icon-container">
                    <img
                      className="menu-icon"
                      src={imagePath(item.icon)}
                      alt={`${item.icon}`}
                    />
                    <Link to={item.href}>{item.name}</Link>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <MyJob />
        </div>
      </div>
    </>
  );
}

export default LandingView;
