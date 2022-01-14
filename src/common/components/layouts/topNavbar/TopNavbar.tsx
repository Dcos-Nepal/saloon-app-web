import "boxicons";
import { FC } from "react";

import logo from "assets/images/Logo.svg";
import avatar from "assets/images/Avatar.svg";

interface IProps {
  loggedIn?: boolean;
}

const TopNavbar: FC<IProps> = ({ loggedIn = true }) => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="ms-3 me-3 container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} height="34px" alt="Orange" />
        </a>

        {loggedIn && (
          <>
            <form className="ms-4 form-inline navbar-nav me-auto">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input bg-light-grey"
                  placeholder="Search"
                />
              </div>
            </form>
            <ul className="d-flex navbar-nav">
              <li className="nav-item me-3 mt-1">
                <box-icon name="bell"></box-icon>
              </li>
              <li className="nav-item">
                <div className="dropdown dropstart">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={avatar} height="34px" alt="Orange" />
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a className="dropdown-item" href="#">View Profile</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Logout</a></li>
                  </ul>
                </div>
              </li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
