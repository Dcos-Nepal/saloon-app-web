const PropertyDetail = ({ setEditPropertyFor, property }: any) => {
  return (
    <div className="p-3 mb-2 card">
      <div className="row">
        <div className="col txt-dark-grey txt-bold">{property.name}</div>
        <div className="col">
          <span onClick={() => setEditPropertyFor(property)} className="float-end pointer">
            <box-icon name="pencil" color="#666666" />
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-12 p-2 ps-4">
          <div className="txt-grey">Address</div>
          <div className="">{property.street1}, {property.street2}, {property.city} {property.postalCode}</div>
          <div className="">{property.state} {property.country}</div>
          <div className="mt-2">
            <div className="mb-2">
              Taxes <span className="txt-light-orange">GST (10%) Default</span>
            </div>
            <div className="mb-2">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label className="ms-2 form-check-label txt-dark-grey" htmlFor="flexCheckDefault">
                Billing address is the same as property address
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
