import TopNavbar from "../../common/components/layouts/topNavbar";
import SideNavbar from "../../common/components/layouts/sidebar";
import AdminDashboard from "common/components/layouts/AdminDashboard";

const Dashboard = () => {
  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Overview" />
          <div className="col main-container" style={{position: "relative", minHeight: '700px'}}>
            <AdminDashboard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
