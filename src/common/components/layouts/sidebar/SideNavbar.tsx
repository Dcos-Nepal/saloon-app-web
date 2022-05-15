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
  AccessibilityIcon
} from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'utils';

interface IProps {
  active: string;
}

const SideNavbar: FC<IProps> = ({ active }) => {
  const navigate = useNavigate();
  const currUser: { role: string; id: string } = getCurrentUser();

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
          <li>
            <span
              onClick={() => navigate('/dashboard/' + endpoints.admin.schedules.calendar)}
              className={active === 'Schedule' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
            >
              <span className="mt-1">
                <CalendarIcon size={'small'} />
              </span>
              <span className="ms-2 d-none d-sm-inline">Schedule</span>
            </span>
          </li>

          <div className="hr mt-2 mb-2"></div>

          {currUser.role === 'ADMIN' || currUser.role === 'WORKER' ? (
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

          {currUser.role === 'ADMIN' || currUser.role === 'CLIENT' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/' + endpoints.admin.requests.list)}
                className={active === 'Requests' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="mt-2">
                  <InboxIcon size={'small'} />
                </span>
                <span className="ms-2 d-none d-sm-inline">Requests</span>
              </span>
            </li>
          ) :  null}

          {currUser.role === 'ADMIN' || currUser.role === 'WORKER' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/' + endpoints.admin.quotes.list)}
                className={active === 'Quotes' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="mt-2">
                  <FileBadgeIcon size={'small'} />
                </span>
                <span className="ms-2 d-none d-sm-inline">Quotes</span>
              </span>
            </li>
          ) : null}

          {currUser.role === 'ADMIN' || currUser.role === 'WORKER' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/' + endpoints.admin.invoices.list)}
                className={active === 'Invoices' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="pt-2">
                  <box-icon color={active === 'Invoices' ? '#f47321' : '#161C21'} size="15px" name="dollar-circle" />
                </span>
                <span className="ms-2 d-none d-sm-inline">Invoices</span>
              </span>
            </li>
          ) : null}

          <li>
            <span
              onClick={() => navigate('/dashboard/' + endpoints.admin.jobs.list)}
              className={active === 'Jobs' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
            >
              <span className="mt-2">
                <BriefcaseIcon size={'small'} />
              </span>
              <span className="ms-2 d-none d-sm-inline">Jobs</span>
            </span>
          </li>

          {currUser.role === 'ADMIN' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/' + endpoints.admin.worker.list)}
                className={active === 'Workers' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="mt-2">
                  <AccessibilityIcon size={'small'} />
                </span>
                <span className="ms-2 d-none d-sm-inline">Workers</span>
              </span>
            </li>
          ) : null}

          {currUser.role === 'ADMIN' ? (
            <li>
              <span
                onClick={() => navigate('/dashboard/' + endpoints.admin.lineItems.list)}
                className={active === 'LineItems' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
              >
                <span className="mt-2">
                  <LogIcon size={'small'} />
                </span>
                <span className="ms-2 d-none d-sm-inline">Line Items</span>
              </span>
            </li>
          ) : null}

          {!(currUser.role === 'ADMIN') ? (
            <>
              <div className="hr mt-2 mb-2"></div>
              <li>
                <span
                  onClick={() => navigate('/dashboard/' + endpoints.admin.referral.program)}
                  className={active === 'Referral' ? 'nav-link nav-link-active align-middle px-0' : 'nav-link align-middle px-0'}
                >
                  <span className="mt-2">
                    <PeopleIcon size={'small'} />
                  </span>
                  <span className="ms-2 d-none d-sm-inline">Refer a Friend</span>
                </span>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default SideNavbar;
