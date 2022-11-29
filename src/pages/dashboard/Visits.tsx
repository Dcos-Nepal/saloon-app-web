import SideNavbar from 'common/components/layouts/sidebar';
import Footer from 'common/components/layouts/footer';
import VisitList from 'pages/appointments/list/VisitList';
import { useState } from 'react';

const Summary = () => {
  const Tabs = {
    Consulation: 'Consulation',
    Treatment: 'Treatment',
    Maintainance: 'Maintainance',
    FollowUp: 'FollowUp'
  };

  const [tab, setTab] = useState(Tabs.Consulation);

  const TabContent = () => {
    switch (tab) {
      case Tabs.Consulation:
        return <Consultants />;
      case Tabs.Treatment:
        return <Treatments />;
      case Tabs.Maintainance:
        return <Maintainances />;
      case Tabs.FollowUp:
        return <FollowUps />;
      default:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">Nothing to show here</div>
            </div>
          </div>
        );
    }
  };

  const Consultants = () => {
    return (
      <div className="row">
        <VisitList appointmentType={'CONSULATION'}/>
      </div>
    );
  };


  const Maintainances = () => {
    return (
      <div className="row">
        <VisitList appointmentType={'MAINTAINANCE'}/>
      </div>
    );
  };

  const Treatments = () => {
    return (
      <div className="row">
         <VisitList appointmentType={'TREATMENT'}/>
      </div>
    );
  };

  const FollowUps = () => {
    return (
      <div className="row">
         <VisitList appointmentType={'FOLLOW UP'}/>
      </div>
    );
  };

  return (
    <>
      <SideNavbar active="Visits" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="col">
            <h3 className="extra">All Visit List</h3>
          </div>
          <label className="txt-grey">List of visits so far. Both the consultations and treatments</label>
        </div>
        <div className="">
          <div className="row mt-3">
            <div className={`col tab me-1 ${tab === Tabs.Consulation ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Consulation)}>
              Consulations
            </div>
            <div className={`col tab me-1 ${tab === Tabs.Treatment ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Treatment)}>
              Treatments
            </div>
            <div className={`col tab me-1 ${tab === Tabs.Maintainance ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Maintainance)}>
              Maintainance
            </div>
            <div className={`col tab me-1 ${tab === Tabs.FollowUp ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.FollowUp)}>
              Follow Up
            </div>
          </div>
          {<TabContent />}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Summary;
