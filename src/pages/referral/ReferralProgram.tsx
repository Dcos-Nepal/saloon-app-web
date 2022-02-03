import IPhone from "assets/images/iphone-x.svg";
import IPhone1 from "assets/images/iphone-x-1.svg";

const ReferralProgram = () => {
  return (
    <>
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
            <h2 className="txt-dark-grey txt-xl">
              WHEN YOUR COMMUNITY IS STRONG, YOU'RE STRONG.
            </h2>
            <h1 className="txt-dark-grey txt-xxl pe-5">
              REFER <span className="txt-orange">ORANGE CLEANING</span> TO GET{" "}
              <span className="txt-orange">TWO FREE MONTHS.</span>
            </h1>
            <p className="txt-l">
              When you refer a friend to Jobber, they get two free months, you
              help a fellow entrepreneur be successful, and{" "}
              <b>we’ll send you two free months</b> if they become a customer.
            </p>
          </div>
        </div>
      </div>
      <div className="card p-5">
        <h4 className="m-auto txt-bold">
          Share the link below or use code{" "}
          <span className="txt-orange">DANDINH</span>
        </h4>
        <div className="row m-auto mt-4">
          <div className="col-8">
            <input
              className="form-control"
              value="https://share.orangecleaning.com/mQlDbu5"
              disabled
            />
          </div>
          <div className="col">
            <button
              type="button"
              onClick={async () => {}}
              className="btn btn-primary"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <div className="card p-5">
        <h4 className="m-auto txt-bold">Your Referrals</h4>
        <div className="row m-auto">
          <div className="col m-5">
            <div className="p-3-4 text-center dashboard-h1 rounded-radius bg-light-grey">
              10
            </div>
            <label className="txt-bold pt-3  text-center">Referrals Started</label>
          </div>
          <div className="col m-5">
            <div className="p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">
              200
            </div>
            <label className="txt-bold pt-3 text-center">Reward(s) received</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralProgram;
