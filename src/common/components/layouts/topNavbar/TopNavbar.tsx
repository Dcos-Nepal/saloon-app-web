import 'boxicons';
import { FC } from 'react';

import logo from 'assets/images/LogoLong.svg';
import { clearData } from 'utils/storage';
import avatar from 'assets/images/Avatar.svg';
import { GearIcon, LockIcon, PersonIcon } from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from 'common/config';

interface IProps {
  loggedIn?: boolean;
}

const TopNavbar: FC<IProps> = ({ loggedIn = true }) => {
  const navigate = useNavigate();

  const logout = async () => {
    await clearData();
    navigate(endpoints.auth.signIn);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="ms-3 me-3 container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} height="34px" alt="Orange" />
        </a>

        {loggedIn && (
          <>
            <form className="ms-4 form-inline navbar-nav me-auto">
              {/* <div className="input-group">
                <input type="text" className="form-control search-input bg-light-grey" placeholder="Search" />
              </div> */}
            </form>
            <ul className="d-flex navbar-nav">
              {/* <li className="nav-item me-3 mt-1">
                <box-icon name="bell"></box-icon>
              </li> */}
              <li className="nav-item">
                <div className="dropdown dropstart">
                  <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={avatar} height="34px" alt="Orange" />
                  </span>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li onClick={() => navigate('/dashboard/' + endpoints.profile)}>
                      <span className="dropdown-item cursor-pointer">
                        <PersonIcon /> View Profile
                      </span>
                    </li>
                    <li onClick={() => navigate('/dashboard/' + endpoints.setting)}>
                      <span className="dropdown-item cursor-pointer">
                        <GearIcon /> Settings
                      </span>
                    </li>
                    <li onClick={logout}>
                      <span className="dropdown-item cursor-pointer">
                        <LockIcon /> Logout
                      </span>
                    </li>
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
