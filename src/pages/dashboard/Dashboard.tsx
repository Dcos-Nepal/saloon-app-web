import { clearData, getData } from 'utils/storage';
import TopNavbar from '../../common/components/layouts/topNavbar';
import DashboardLayout from 'common/components/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { endpoints } from 'common/config';
import { Loader } from 'common/components/atoms/Loader';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(getData('user'));

  useEffect(() => {
    if (!currentUser || !currentUser?._id) {
      clearData();
      navigate(endpoints.auth.signIn + '?redirect=' + encodeURI(window.location.href));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id])

  return (
    <>
      {!currentUser ? (<Loader isLoading={!currentUser} />) : (
        <>
          <TopNavbar />
          <div className="container-fluid">
            <div className="row flex-nowrap">
              <DashboardLayout />
            </div>
          </div>
        </>
      )}
    </> 
  );
};

export default Dashboard;
