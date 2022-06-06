import 'boxicons';
import { FC, useEffect } from 'react';

import logo from 'assets/images/LogoLong.svg';
import { clearData, getData } from 'utils/storage';
import { GearIcon, LockIcon, PersonIcon } from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { endpoints } from 'common/config';
import { getNameInitials } from 'utils/name';
import { getAccessToken } from 'utils/http';

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
  };

  const fetchEvents = async () => {
    const authToken = await getAccessToken();
    fetchEventSource(process.env.REACT_APP_API + `v1/notifications/events/${currentUser._id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-type': 'text/event-stream'
      },
      onmessage: ({ data }) => {
        console.log(data);
      },
      onerror(err) {
        console.log(err);
      },
    });
  }

  useEffect(() => {
    // fetchEvents()
  }, [])

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="ms-3 me-3 container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} height="34px" alt="Orange" />
          <small style={{ fontSize: '14px' }}>&nbsp; v{version} </small>
        </a>

        {loggedIn && (
          <>
            <ul className="d-flex navbar-nav">
              <li className="nav-item d-flex align-items-center">
                <div className="dropdown dropstart">
                  <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    {/* <img src={avatar} height="34px" alt="Orange" /> */}
                    <div className="circle">
                      <p className="text">{getNameInitials(currentUser)}</p>
                    </div>
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
                  <div className="text-sm">
                    Role: <strong style={{ fontSize: '12px' }}>{currentUser.roles.toString()}</strong>
                  </div>
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
