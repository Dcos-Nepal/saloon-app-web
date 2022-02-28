import { clearData, getData } from 'utils/storage';
import TopNavbar from '../../common/components/layouts/topNavbar';
import AdminDashboard from 'common/components/layouts/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { endpoints } from 'common/config';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = getData('user');

  if (!currentUser || !currentUser._id) {
    clearData();
    navigate(endpoints.auth.signIn);
  }

  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <AdminDashboard />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
