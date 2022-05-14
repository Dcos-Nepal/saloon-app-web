import 'boxicons';
import { FC } from 'react';

import logo from 'assets/images/LogoLong.svg';
import { clearData, getData } from 'utils/storage';
import avatar from 'assets/images/Avatar.svg';
import { GearIcon, LockIcon, PersonIcon } from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from 'common/config';

interface IProps {
  loggedIn?: boolean;
}

const TopNavbar: FC<IProps> = ({ loggedIn = true }) => {
  const navigate = useNavigate();
  const currentUser = getData('user');
  const { version } = require('../../../../../package.json');

  /**
   * Logs out user
   */
  const logout = async () => {
    await clearData();
    navigate(endpoints.auth.signIn);
  };

  /**
   * Gets Current logged in user name
   */
  const getUserName = () => {
    return currentUser ? `${currentUser?.firstName} ${currentUser?.lastName}` : 'Guest';
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="ms-3 me-3 container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} height="34px" alt="Orange" />
          <small style={{fontSize: '14px'}}>&nbsp; v{version} </small>
        </a>

        {loggedIn && (
          <>
            <ul className="d-flex navbar-nav">
              <li className="nav-item d-flex align-items-center">
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
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div className="text-secondary">
                  <div>{getUserName()}</div>
                  <div className='text-sm'>Role: <strong style={{fontSize: '12px'}}>{currentUser.roles.toString()}</strong></div>
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
