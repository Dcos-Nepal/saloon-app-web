import { clearData, getData, setData } from 'utils/storage';
import TopNavbar from '../../common/components/layouts/topNavbar';
import AdminDashboard from 'common/components/layouts/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { endpoints } from 'common/config';
import { Loader } from 'common/components/atoms/Loader';
import { useEffect, useState } from 'react';
import { AlertFillIcon } from '@primer/octicons-react';
import { meApi } from 'services/auth.service';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getData('user'));

  const pullCurrentUserData = async () => {
    const response = await meApi();
    setData('user', response?.data?.data || null);
    setCurrentUser(response?.data?.data || null);
  }

  useEffect(() => {
    if (!currentUser || !currentUser?._id) {
      clearData();
      navigate(endpoints.auth.signIn + '?redirect=' + encodeURI(window.location.href));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id])

  useEffect(() => {
    pullCurrentUserData();
  }, [])

  return (
    <>
      {!currentUser ? (<Loader isLoading={!currentUser} />) : (
        <>
          <TopNavbar />
          {!currentUser?.userData.isApproved && currentUser.roles.includes('WORKER')? (
            <div className="col-12">
              <div className="alert alert-danger mb-0 text-center" role="alert">
                <span><AlertFillIcon />&nbsp; <strong>Worker Approval Pending!</strong></span>
                <div>It seems you have not filled all your details in your profile. Without approval you won't be able to create clients, Quotes or Jobs.</div>
                <div className="mt-2"><button onClick={() => window.location.reload()} className='btn btn-sm btn-primary'>CLick to Reload</button></div>
              </div>
            </div>
          ) : null }
          <div className="container-fluid">
            <div className="row flex-nowrap">
              <AdminDashboard />
            </div>
          </div>
        </>
      )}
    </> 
  );
};

export default Dashboard;
