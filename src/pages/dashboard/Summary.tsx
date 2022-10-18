import { getCurrentUser } from 'utils';
import SideNavbar from 'common/components/layouts/sidebar';
import Footer from 'common/components/layouts/footer';
import QuoteList from 'pages/appointments/list';

const Summary = () => {
  const currUser = getCurrentUser();

  const isAdmin = () => {
    return (currUser.role === 'ADMIN');
  }

  const isShopAdmin = () => {
    return (currUser.role === 'SHOP_ADMIN');
  }

  return (
    <>
      <SideNavbar active="Overview" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="col">
            <h3 className="extra">Appointments</h3>
          </div>
          <label className="txt-grey">There are of quotes created so far.</label>
        </div>
        <div className="row mt-3 pb-3">
          <div className="col-12">
            <QuoteList appointmentType={'CONSULTATION'}/>
          </div>
          <div className="col-12">
            <QuoteList appointmentType={'SERVICE'}/>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Summary;
