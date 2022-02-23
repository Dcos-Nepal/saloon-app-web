import { clearData, getData } from 'utils/storage';
import TopNavbar from '../../common/components/layouts/topNavbar';
import AdminDashboard from 'common/components/layouts/AdminDashboard';

const Dashboard = () => {
  const currentUser = getData('user');

  if (!currentUser || !currentUser._id) {
    clearData();
    window.location.href = '/';
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
