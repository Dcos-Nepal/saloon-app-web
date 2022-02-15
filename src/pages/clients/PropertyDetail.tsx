const PropertyDetail = ({ setEditPropertyFor, property }: any) => {
  return (
    <div className="p-2 mb-3">
      <div className="row">
        <div className="col txt-dark-grey txt-bold">{property.name}</div>
        <div className="col">
          <span onClick={() => setEditPropertyFor(property)} className="float-end pointer">
            <box-icon name="pencil" color="#666666" />
          </span>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="col p-2 ps-4">
          <div className="txt-grey">Street 1</div>
          <div className="">{property.street1}</div>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="col p-2 ps-4">
          <div className="txt-grey">Street 2</div>
          <div className="">{property.street2}</div>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="col p-2 ps-4">
          <div className="txt-grey">City</div>
          <div className="">{property.city}</div>
        </div>
        <div className="col p-2 ps-4">
          <div className="txt-grey">State</div>
          <div className="">{property.state}</div>
        </div>
      </div>
      <div className="row border-bottom mb-3">
        <div className="col p-2 ps-4">
          <div className="txt-grey">Post code</div>
          <div className="">{property.postalCode}</div>
        </div>
        <div className="col p-2 ps-4">
          <div className="txt-grey">Country</div>
          <div className="">{property.country}</div>
        </div>
      </div>

      <div className="mb-3">
        Taxes <span className="txt-light-orange">GST (10%) Default</span>
      </div>

      <div className="mb-3">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
        <label className="ms-2 form-check-label txt-dark-grey" htmlFor="flexCheckDefault">
          Billing address is the same as property address
        </label>
      </div>
    </div>
  );
};

export default PropertyDetail;
