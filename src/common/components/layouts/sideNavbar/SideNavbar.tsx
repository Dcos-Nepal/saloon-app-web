import "boxicons";
import { endpoints } from "common/config";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  active: string;
}

const SideNavbar: FC<IProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar col-auto col-md-3 col-xl-2 px-sm-2 px-0">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2">
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="nav-item">
            <span
              onClick={() => navigate(endpoints.admin.home)}
              className={
                active === "Overview"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Overview" ? "#f47321" : "#161C21"}
                  size="16px"
                  name="home"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Overview</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => navigate("/schedules")}
              className={
                active === "Schedule"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Schedule" ? "#f47321" : "#161C21"}
                  size="16px"
                  name="calendar"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Schedule</span>
            </span>
          </li>

          <div className="hr mt-2 mb-2"></div>

          <li>
            <span
              onClick={() => navigate("/clients")}
              className={
                active === "Clients"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Clients" ? "#f47321" : "#161C21"}
                  size="16px"
                  type="solid"
                  name="user-badge"
                ></box-icon>
              </span>
              <span className="ms-2 d-none d-sm-inline">Clients</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => navigate(endpoints.admin.requests.list)}
              className={
                active === "Requests"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Requests" ? "#f47321" : "#161C21"}
                  size="16px"
                  type="solid"
                  name="inbox"
                ></box-icon>
              </span>
              <span className="ms-2 d-none d-sm-inline">Request</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => navigate(endpoints.admin.referral.program)}
              className={
                active === "Quotes"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Quotes" ? "#f47321" : "#161C21"}
                  size="16px"
                  type="solid"
                  name="file-import"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Quotes</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => navigate(endpoints.admin.referral.program)}
              className={
                active === "Jobs"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Jobs" ? "#f47321" : "#161C21"}
                  size="16px"
                  name="briefcase"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Jobs</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => navigate(endpoints.admin.referral.program)}
              className={
                active === "Invoices"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Invoices" ? "#f47321" : "#161C21"}
                  size="16px"
                  name="dollar-circle"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Invoices</span>
            </span>
          </li>
          <li>
            <span
              onClick={() => navigate(endpoints.admin.referral.program)}
              className={
                active === "Workers"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Workers" ? "#f47321" : "#161C21"}
                  size="16px"
                  type="solid"
                  name="user-account"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Workers</span>
            </span>
          </li>

          <div className="hr mt-2 mb-2"></div>

          <li>
            <span
              onClick={() => navigate(endpoints.admin.referral.program)}
              className={
                active === "Refer"
                  ? "nav-link nav-link-active align-middle px-0"
                  : "nav-link align-middle px-0"
              }
            >
              <span className="mt-2">
                <box-icon
                  color={active === "Referral" ? "#f47321" : "#161C21"}
                  size="16px"
                  type="solid"
                  name="user-account"
                />
              </span>
              <span className="ms-2 d-none d-sm-inline">Refer a Friend</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNavbar;
