import TopNavbar from "../../common/components/layouts/topNavbar";
import SideNavbar from "../../common/components/layouts/sideNavbar";

const Dashboard = () => {
  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Overview" />
          <div className="col main-container">
            <div className="">
              <div className="d-flex flex-row">
                <h1>Home</h1>
              </div>
              <div className="d-flex flex-row-reverse">
                <button type="button" className="btn btn-primary d-flex">
                  Create
                </button>
              </div>
            </div>
            <div className="rounded-3 bg-white mt-4 p-4">
              <b className="">Today’s appointments</b>
              <div className="row mt-4 mb-4">
                <div className="col">
                  <span className="pt-3 pb-3 ps-5 pe-5 dashboard-h1 rounded-3 bg-grey">
                    3
                  </span>
                  <span>Total $0.00</span>
                </div>
                <div className="col">
                  <span className="pt-3 pb-3 ps-5 pe-5 dashboard-h1 rounded-3 bg-light-red">
                    3
                  </span>
                  <span>To Go $0.00</span>
                </div>
                <div className="col">
                  <span className="pt-3 pb-3 ps-5 pe-5 dashboard-h1 rounded-3 bg-light-blue">
                    0
                  </span>
                  <span>Active $0.00</span>
                </div>
                <div className="col">
                  <span className="pt-3 pb-3 ps-5 pe-5 dashboard-h1 rounded-3 bg-light-green">
                    0
                  </span>
                  <span>Complete $0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
