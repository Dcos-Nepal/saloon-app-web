import SideNavbar from 'common/components/layouts/sidebar';
import Footer from 'common/components/layouts/footer';
import { QuoteList } from 'pages/appointments/list';
import { useState } from 'react';

const Appointments = () => {
  const Tabs = {
    Consulation: 'Consulation',
    Treatment: 'Treatment'
  };

  const [tab, setTab] = useState(Tabs.Consulation);

  const TabContent = () => {
    switch (tab) {
      case Tabs.Consulation:
        return <Consulation />;
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

  const Consulation = () => {
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
      <SideNavbar active="Quotes" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="col">
            <h3 className="extra">Appointments</h3>
          </div>
          <label className="txt-grey">List of appontments scheduled so far. Both the consultations and treatments</label>
        </div>
        <div className="">
          <div className="row mt-3">
            <div className={`col tab me-1 ${tab === Tabs.Consulation ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Consulation)}>
              Consulations
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

export default Appointments;
