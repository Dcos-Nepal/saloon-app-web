const PropertyDetail = () => {
  return (
    <div className="p-2">
      <div className="row">
        <div className="col txt-dark-grey txt-bold">Property -1</div>
        <div className="col">
          <span className="float-end pointer">
            <box-icon name="pencil" color="#666666" />
          </span>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="col p-2 ps-4">
          <div className="txt-grey">Street 1</div>
          <div className="">91 Woolnough Road</div>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="col p-2 ps-4">
          <div className="txt-grey">Street 2</div>
          <div className="">7 Delan Road</div>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="col p-2 ps-4">
          <div className="txt-grey">City</div>
          <div className="">Tusmore</div>
        </div>
        <div className="col p-2 ps-4">
          <div className="txt-grey">State</div>
          <div className="">South Australia</div>
        </div>
      </div>
      <div className="row border-bottom mb-3">
        <div className="col p-2 ps-4">
          <div className="txt-grey">Post code</div>
          <div className="">5065</div>
        </div>
        <div className="col p-2 ps-4">
          <div className="txt-grey">Country</div>
          <div className="">Australia</div>
        </div>
      </div>

      <div className="mb-3">
      Taxes <span className="txt-light-orange">GST (10%) Default</span>
      </div>

      <div className="mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
        <label className="ms-2 form-check-label txt-dark-grey" htmlFor="flexCheckDefault">
          Billing address is the same as property address
        </label>
      </div>
      <div className="dashed bold txt-orange pointer">
        + Additional property details
      </div>
    </div>
  );
};

export default PropertyDetail;
