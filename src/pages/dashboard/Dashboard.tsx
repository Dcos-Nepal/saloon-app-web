import TopNavbar from "../../common/components/layouts/topNavbar";
import SideNavbar from "../../common/components/layouts/sideNavbar";
import Footer from "common/components/layouts/footer";

const Dashboard = () => {
  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Overview" />
          <div className="col main-container">
            <div className="row">
              <div className="col d-flex flex-row">
                <h1>Home</h1>
              </div>
              <div className="col">
                <button type="button" className="btn btn-primary d-flex float-end">
                  Create
                </button>
              </div>
            </div>
            <div className="rounded-radius bg-white mt-4 p-4">
              <b className="">Today’s appointments</b>
              <div className="row mt-4 mb-4">
                <div className="col row">
                  <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-grey">
                    3
                  </div>
                  <div className="col dashboard-main-label">
                    Total <p className="txt-bold-big mt-2">$0.00</p>
                  </div>
                </div>
                <div className="col row">
                  <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-red">
                    3
                  </div>
                  <div className="col dashboard-main-label">
                    To Go <p className="txt-bold-big mt-2">$0.00</p>
                  </div>
                </div>
                <div className="col row">
                  <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">
                    0
                  </div>
                  <div className="col dashboard-main-label">
                    Active <p className="txt-bold-big mt-2">$0.00</p>
                  </div>
                </div>
                <div className="col row">
                  <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-green">
                    0
                  </div>
                  <div className="col dashboard-main-label">
                    Complete <p className="txt-bold-big mt-2">$0.00</p>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
