import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { homeMenu } from "@/assets/menu";
import LandingView from "@/components/home";
import { darkThemeClass, imagePath } from "@/utils/utils";
import "./styles.css";

function Home() {
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-home-card-theme", theme);

  return (
    <MainLayout>
      <div className="container">
        <div className="mb-5">
          <h2 className="display-4">Harvester Data Store</h2>
        </div>
        <LandingView theme={theme} />
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
      </div>
    </MainLayout>
  );
}

export default Home;
