import "boxicons";

import logo from "assets/images/Logo.svg";
import avatar from "assets/images/Avatar.svg";

const TopNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="ms-3 me-3 container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} height="34px" alt="Orange" />
        </a>
        <form className="ms-4 form-inline navbar-nav me-auto">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search" />
          </div>
        </form>
        <ul className="d-flex navbar-nav">
          <li className="nav-item me-3 mt-1">
            <box-icon name="bell"></box-icon>
          </li>
          <li className="nav-item">
            <img src={avatar} height="34px" alt="Orange" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TopNavbar;
