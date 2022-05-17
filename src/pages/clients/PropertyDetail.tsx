import { getPropertyAddress } from "utils";

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
        <div className="col-12">
          <div className="">{getPropertyAddress(property)}</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
