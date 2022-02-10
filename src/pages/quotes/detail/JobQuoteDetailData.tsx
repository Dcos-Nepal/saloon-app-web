import InputField from "common/components/form/Input";

const JobQuoteDetailData = () => {
  // const columns: Column<any>[] = useMemo(() => [], []);

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({ columns, data: [] });

  return (
    <div>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <div className="row">
              <div className="col">
                <h5 className="txt-bold">Bonnie Green</h5>
                <div>
                  <span className={`status status-green`}>
                    Requires invoicing
                  </span>
                </div>
              </div>
              <div className="col">
                <h4 className="txt-bold d-flex float-end mt-2">$80 cash</h4>
              </div>
            </div>
            <div className="row mt-3 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Property address</div>
                <div className="">
                  8 Creswell Court, Gilberton, South Australia 5081
                </div>
              </div>
            </div>
            <div className="row mb-4 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Contact details</div>
                <div className="">0409 096 066</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Quote Detail</h6>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Quote number</div>
                <div className="row">
                  <div className="col">#13</div>
                  <div className="col txt-orange pointer">Change</div>
                </div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Quote type</div>
                <div className="">Recurring job</div>
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Started on</div>
                <div className="">Aug 23, 2021</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Lasts for</div>
                <div className="">6 years</div>
              </div>
            </div>
            <div className="row border-bottom mb-3">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Billing frequency</div>
                <div className="">After every visit</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Schedule</div>
                <div className="">Every 2 weeks on Mondays</div>
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
          <button onClick={() => {}} type="button" className="btn btn-primary">
            Save
          </button>
          <button
            onClick={() => {}}
            type="button"
            className="ms-3 btn btn-secondary"
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

      <div className="card">
        <div className="row bg-grey m-2 p-3">
          <div className="col d-flex flex-row">
            <h6 className="txt-bold mt-2">Visits</h6>
          </div>
          <div className="col">
            <button
              onClick={() => {}}
              type="button"
              className="btn btn-primary d-flex float-end"
            >
              New visit
            </button>
          </div>
        </div>

        {/* <table {...getTableProps()} className="table txt-dark-grey">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} scope="col">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="rt-tbody">
            {rows.map((row) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()} className="rt-tr-group">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default JobQuoteDetailData;
