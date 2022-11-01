import 'boxicons';
import { FC } from 'react';
import { endpoints } from 'common/config';

import {
  LogIcon,
  HomeIcon,
  InboxIcon,
  PeopleIcon,
  CalendarIcon,
  BriefcaseIcon,
  FileBadgeIcon,
  PersonFillIcon,
  LockIcon
} from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'utils';
import { clearData } from 'utils/storage';

interface IProps {
  active: string;
}

const SideNavbar: FC<IProps> = ({ active }) => {
  const navigate = useNavigate();
  const currUser: { role: string; id: string } = getCurrentUser();

  /**
   * Logs out user
   */
  const logout = async () => {
    await clearData();
    navigate(endpoints.auth.signIn);
  };

  return (
    <div className="sidebar col-auto col-md-3 col-xl-2 px-sm-2 px-0">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2">
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
          <li className="nav-item">
            <span
              onClick={() => navigate('/dashboard')}
              className={active === 'Overview' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
            >
              <span className="mt-1">
                <HomeIcon size={'small'} />
              </span>
              <span className="ms-2 d-none d-sm-inline">Overview</span>
            </span>
          </li>

          <div className="hr mt-2 mb-2"></div>

          {currUser.role === 'SHOP_ADMIN' || currUser.role === 'ADMIN' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/' + endpoints.admin.client.list)}
                className={active === 'Clients' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="mt-1">
                  <PersonFillIcon size={'small'} />
                </span>
                <span className="ms-2 d-none d-sm-inline">Clients</span>
              </span>
            </li>
          ) : null}

          <li>
            <span
              onClick={() => navigate('/dashboard/' + endpoints.admin.schedules.calendar)}
              className={active === 'Schedule' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
            >
              <span className="mt-1">
                <CalendarIcon size={'small'} />
              </span>
              <span className="ms-2 d-none d-sm-inline">Booking</span>
            </span>
          </li>

          <li className="nav-item">
            <span
              onClick={() => navigate('/dashboard')}
              className={active === 'Overview' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
            >
              <span className="mt-1">
                <HomeIcon size={'small'} />
              </span>
              <span className="ms-2 d-none d-sm-inline">Appointments</span>
            </span>
          </li>

          {currUser.role === 'SHOP_ADMIN' || currUser.role === 'ADMIN' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/visits')}
                className={active === 'visits' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="mt-2">
                  <FileBadgeIcon size={'small'} />
                </span>
                <span className="ms-2 d-none d-sm-inline">Visits</span>
              </span>
            </li>
          ) : null}

          <div className="hr mt-2 mb-2"></div>
          <li>
            <span onClick={() => logout()} className={'nav-link align-middle px-0'}>
              <span className="mt-2">
                <LockIcon size={'small'} />
              </span>
              <span className="ms-2 d-none d-sm-inline">Logout</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNavbar;
