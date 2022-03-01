import IPhone from 'assets/images/iphone-x.svg';
import IPhone1 from 'assets/images/iphone-x-1.svg';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { getData } from 'utils/storage';
import { toast } from 'react-toastify';

const ReferralProgram = () => {
  const user = getData('user');
  const referralCode = user?.userData?.referralCode || '';
  const referralUrl = `${window.location.host}/signup?referralCode=${referralCode}`;

  return (
    <>
      <SideNavbar active="Referral" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="col">
            <h3>Referral Program</h3>
          </div>
        </div>
        <div className="card bg-white mt-4 p-4">
          <div className="row mt-4 mb-4">
            <div className="col-4 ps-5 ms-5">
              <img className="referral-phone" src={IPhone} alt="Referral" />
              <img className="referral-phone-1" src={IPhone1} alt="Referral" />
            </div>
            <div className="col pe-5">
              <h2 className="txt-dark-grey txt-xl">WHEN YOUR COMMUNITY IS STRONG, YOU'RE STRONG.</h2>
              <h1 className="txt-dark-grey txt-xxl pe-5">
                REFER <span className="txt-orange">ORANGE CLEANING</span> TO GET <span className="txt-orange">TWO FREE MONTHS.</span>
              </h1>
              <p className="txt-l">
                When you refer a friend to Orange, they get two free months, you help a fellow entrepreneur be successful, and{' '}
                <b>we’ll send you two free months</b> if they become a customer.
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <h4 className="m-auto txt-bold">
            Share the link below or use code <span className="txt-orange">{referralCode}</span>
          </h4>
          <div className="">
            <div className="row mt-4">
              <div className="col"></div>
              <div className="col-5">
                <input className="form-control" value={referralUrl} disabled />
              </div>
              <div className="col-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(referralUrl);
                    toast.success('Copied to clipboard!');
                  }}
                  className="btn btn-primary full-width"
                >
                  Copy Link
                </button>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <h4 className="m-auto txt-bold">Your Referrals</h4>
          <div className="row m-auto">
            <div className="col m-5">
              <div className="p-3-4 text-center dashboard-h1 rounded-radius bg-light-grey">10</div>
              <label className="txt-bold pt-3  text-center">Referrals Started</label>
            </div>
            <div className="col m-5">
              <div className="p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">200</div>
              <label className="txt-bold pt-3 text-center">Reward(s) received</label>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ReferralProgram;
