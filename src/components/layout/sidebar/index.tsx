import { useRef } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { API_BASE_URL } from "@/features/base/constants";
import useClickOutside from "@/hooks/useClickOutside";
import Logo from "@/assets/images/aft_logo.png";
import "./styles.css";
import { darkThemeClass } from "@/utils/utils";

interface SideBarProps {
  openSideBar: boolean;
  closeSideBar: () => void;
}

function SideBar({ openSideBar, closeSideBar }: SideBarProps) {
  const sideRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);
  const adminUrl =
    import.meta.env.REACT_APP_ADMIN_URL || `${API_BASE_URL}/admin`;
  const year = new Date().getFullYear();

  useClickOutside(sideRef, () => {
    closeSideBar();
  });

  const sidedark = darkThemeClass("sidedark", theme);
  const squarexd = darkThemeClass("square-x-d", theme);
  const sideappd = darkThemeClass("side-apps-d", theme);
  const accordion = darkThemeClass("accordion-d", theme);
  const accitemd = darkThemeClass("accordion-item-d", theme);
  const listgd = darkThemeClass("list-group-d", theme);

  return (
    <>
      {openSideBar && (
        <div className={`sidebar ${sidedark}`} ref={sideRef}>
          <div className="wrapper">
            <div className="top-section">
              <Link to="/">
                <img src={Logo} alt="" className="side-logo" />
              </Link>
              <div className={`square-x ${squarexd}`} onClick={closeSideBar}>
                x
              </div>
            </div>

            <div className={`side-apps scrollbar ${sideappd}`}>
              <div className="common-apps">APPS</div>

              <div className={`accordion ${accordion}`} id="accordionApps">
                <div className={`accordion-item ${accitemd}`}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Harvesters Section
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionApps"
                  >
                    <div className="accordion-body">
                      <ul className={`list-group ${listgd}`}>
                        <li className="list-group-item hover1">
                          <Link to={"/harvesters"} className="link-color">
                            Harvester
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/locations"} className="link-color">
                            Location
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/distributors"} className="link-color">
                            Distributors
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/harvesterhistory"} className="link-color">
                            Harvester History
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/release"} className="link-color">
                            AFT Releases
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={`accordion-item ${accitemd}`}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Event Related
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionApps"
                  >
                    <div className="accordion-body">
                      <ul className={`list-group ${listgd}`}>
                        <li className="list-group-item hover1">
                          <Link to={"/events"} className="link-color">
                            Events
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/picksessions"} className="link-color">
                            Pick Session
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/notifications"} className="link-color">
                            Notification
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={`accordion-item ${accitemd}`}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Others Apps
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionApps"
                  >
                    <div className="accordion-body">
                      <ul className={`list-group ${listgd}`}>
                        <li className="list-group-item hover1">
                          <Link to={"/s3files"} className="link-color">
                            S3Files
                          </Link>
                        </li>
                        <li className="list-group-item hover1">
                          <Link to={"/logsession"} className="link-color">
                            AFTvplus
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {user?.is_superuser && (
                  <div className={`accordion-item ${accitemd}`}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        Advanced Section
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionApps"
                    >
                      <div className="accordion-body">
                        <ul className={`list-group ${listgd}`}>
                          <li className="list-group-item hover1">
                            <Link to={"/migrations"} className="link-color">
                              HDS Migration
                            </Link>
                          </li>
                          <li className="list-group-item hover1">
                            <Link to={"/users"} className="link-color">
                              Users
                            </Link>
                          </li>
                          <li className="list-group-item hover1">
                            <a
                              href={adminUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-color"
                            >
                              Administator
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sidebar-footer">
              &copy; {year} Advanced Farm Technologies INC
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideBar;
