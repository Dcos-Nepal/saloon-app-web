import SideNavbar from 'common/components/layouts/sidebar';
import Footer from 'common/components/layouts/footer';
import { QuoteList } from 'pages/appointments/list';
import { useState } from 'react';

const Summary = () => {
  const Tabs = {
    Consultation: 'Consultation',
    Treatment: 'Treatment'
  };

  const [tab, setTab] = useState(Tabs.Consultation);

  const TabContent = () => {
    switch (tab) {
      case Tabs.Consultation:
        return <Consultants />;
      case Tabs.Treatment:
        return <Treatments />;
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
        <QuoteList appointmentType={'CONSULTATION'}/>
      </div>
    );
  };

  const Treatments = () => {
    return (
      <div className="row">
         <QuoteList appointmentType={'TREATMENT'}/>
      </div>
    );
  };

  return (
    <>
      <SideNavbar active="Overview" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="col">
            <h3 className="extra">Appointments</h3>
          </div>
          <label className="txt-grey">List of appontments scheduled so far. Both the consultations and treatments</label>
        </div>
        <div className="">
          <div className="row mt-3">
            <div className={`col tab me-1 ${tab === Tabs.Consultation ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Consultation)}>
              Consultations
            </div>
            <div className={`col tab me-1 ${tab === Tabs.Treatment ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Treatment)}>
              Treatments
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
