import { useNavigate } from "react-router-dom";

import { endpoints } from "common/config";
import ClientDetailForm from "../ClientDetailForm";
import Footer from "common/components/layouts/footer";
import TopNavbar from "common/components/layouts/topNavbar";
import SideNavbar from "common/components/layouts/sideNavbar";
import PropertyDetail from "./PropertyDetail";

const ClientAdd = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Clients" />

          <div className="col main-container">
            <div className="">
              <div
                className="txt-orange pointer"
                onClick={() => navigate(endpoints.admin.client.list)}
              >
                <span className="col me-1">
                  <box-icon name="arrow-back" size="xs" color="#EC7100" />
                </span>
                <span className="col">Back to previous</span>
              </div>
              <div className="d-flex flex-row">
                <h1>New Client</h1>
              </div>
            </div>
            <div className="row">
              <div className="col card">
                  <h5>Client Details</h5>
                  <ClientDetailForm />
              </div>
              <div className="col card ms-3">
                  <h5>Property Details</h5>
                  <PropertyDetail />
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAdd;
