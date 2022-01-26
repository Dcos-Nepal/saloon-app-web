import { useMemo } from "react";
import { Column, useTable } from "react-table";

import InputField from "common/components/form/Input";

const QuoteAddForm = () => {
  const columns: Column<any>[] = useMemo(() => [], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: [] });

  return (
    <form>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Client Name</h6>
            <div className="txt-bold mt-3 txt-grey">Property -1</div>
            <div className="row mb-2 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Street 1</div>
                <div className="">91 Woolnough Road</div>
              </div>
            </div>
            <div className="row mb-2 border-bottom">
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
            <div className="row border-bottom mb-2">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Post code</div>
                <div className="">5065</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Country</div>
                <div className="">Australia</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card pb-5">
            <h6 className="txt-bold">Job Detail</h6>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job number</div>
                <div className="row">
                  <div className="col">#13</div>
                  <div className="col txt-orange pointer">Change</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h6 className="txt-bold">Line items</h6>
        <div className="row border-bottom">
          <div className="col-4 p-2 ps-4">
            <div className="bg-light-grey txt-grey p-2 txt-bold">
              PRODUCT / SERVICE
            </div>
            <InputField label="" placeholder="Name" />
            <div className="mb-3">
              <textarea
                className={`form-control`}
                placeholder={"Description"}
              />
            </div>
          </div>
          <div className="col p-2 ps-4">
            <div className="bg-light-grey txt-grey p-2 txt-bold">QTY.</div>
            <InputField type="number" label="" value={0} placeholder="0" />
          </div>

          <div className="col p-2 ps-4">
            <div className="bg-light-grey txt-grey p-2 txt-bold">
              UNIT PRICE
            </div>
            <div className="row">
              <div className="col-1 mt-3 pt-2 pe-4">
                <box-icon name="dollar"></box-icon>
              </div>
              <div className="col">
                <InputField type="number" label="" value={0} placeholder="0" />
              </div>
            </div>
          </div>
          <div className="col p-2 ps-4">
            <div className="bg-light-grey txt-grey p-2 txt-bold">TOTAL</div>
            <div className="row">
              <div className="col-1 mt-3 pt-2 pe-4">
                <box-icon name="dollar"></box-icon>
              </div>
              <div className="col">
                <InputField type="number" label="" value={0} placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 mt-3">
          <button
            onClick={() => {}}
            type="button"
            className="btn btn-secondary"
          >
            Add line item
          </button>
          <button onClick={() => []} type="button" className="btn">
            Delete
          </button>
        </div>

        <div className="hr mb-3"></div>

        <div className="row mb-3">
          <div className="col d-flex flex-row">
            <h6 className="txt-bold mt-2">Total</h6>
          </div>
          <div className="col txt-bold mt-2">
            <div className="d-flex float-end">$ 0.00</div>
          </div>
        </div>
      </div>

      <div className="mb-3 mt-3">
        <button onClick={() => {}} type="button" className="btn btn-primary">
          Save Quote
        </button>
        <button
          onClick={() => {}}
          type="button"
          className="btn btn-secondary ms-3"
        >
          Save and create another
        </button>
        <button onClick={() => []} type="button" className="btn ms-3">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default QuoteAddForm;
