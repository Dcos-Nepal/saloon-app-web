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
      <div className="rounded-radius bg-white mt-4 p-4">
        <div className="row mt-4 mb-4">
          <div className="col-4">
            <img className="referral-phone" src={IPhone} alt="Referral" />
            <img
              className="referral-phone-1"
              src={IPhone1}
              alt="Referral"
            />
          </div>
          <div className="col">
            <h2 className="txt-dark-grey">WHEN YOUR COMMUNITY IS STRONG, YOU'RE STRONG.</h2>
            <h1 className="txt-dark-grey">REFER <span className="txt-orange">ORANGE CLEANING</span> TO GET <span className="txt-orange">TWO FREE MONTHS.</span></h1>
            <p>
              When you refer a friend to Jobber, they get two free months,
              you help a fellow entrepreneur be successful, and <b>we’ll send
              you two free months</b> if they become a customer.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralProgram;
