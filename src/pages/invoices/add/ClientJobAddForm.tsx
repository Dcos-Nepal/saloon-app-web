import { useMemo } from "react";
import { Column, useTable } from "react-table";

import InputField from "common/components/form/Input";

const ClientJobAddForm = () => {
  const columns: Column<any>[] = useMemo(
    () => [

    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: [] });

  return (
    <form>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Client Name</h6>
            <InputField label="Title" placeholder="Enter title" />
            <div className="mb-3">
              <label
                htmlFor="instructions"
                className="form-label txt-dark-grey"
              >
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                className={`form-control`}
                placeholder={"Enter instructions"}
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Job Detail</h6>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job number</div>
                <div className="row">
                  <div className="col">#13</div>
                  <div className="col txt-orange pointer">Change</div>
                </div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job type</div>
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

      <div className="card ">
        <div className="row mt-3 mb-3">
          <div className="col">
            <div className="ms-2 pt-4 row border-top-orange">
              <div className="col-1">
                <box-icon size="md" name="calendar-week"></box-icon>
              </div>
              <div className="col ms-2">
                <h5>ONE-OFF JOB</h5>
                <p>A one time job with one or more visits</p>
              </div>
            </div>
            <div className="card">
              <h6 className="txt-bold">Schedule</h6>
              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <InputField label="Start date" type="date" />
                  </div>
                  <div className="col">
                    <InputField label="End date" type="date" />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <InputField label="Start time" type="time" />
                  </div>
                  <div className="col">
                    <InputField label="End time" type="time" />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label
                  className="ms-2 form-check-label"
                  htmlFor="flexCheckDefault"
                >
                  Schedule later
                </label>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="me-2 pt-4 row bg-light-grey">
              <div className="col-1">
                <box-icon size="md" name="calendar"></box-icon>
              </div>
              <div className="col ms-2">
                <h5>RECURRING JOB</h5>
                <p>A one time job with one or more visits</p>
              </div>
            </div>
            <div className="card">
              <div className="row mb-3">
                <div className="col d-flex flex-row">
                  <h6 className="txt-bold mt-2">Team</h6>
                </div>
                <div className="col">
                  <button
                    onClick={() => {}}
                    type="button"
                    className="btn btn-secondary d-flex float-end"
                  >
                    Assign
                  </button>
                </div>
              </div>
              <div className="row m-2 bg-light-grey">
                <div className="col p-2 txt-black txt-bold">Dan Dinh</div>
                <div className="col-1 m-2 pointer">
                  <box-icon name="x-square" type="solid" color="#FF0048" />
                </div>
              </div>

              <div className="mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label
                  className="ms-2 form-check-label"
                  htmlFor="flexCheckDefault"
                >
                  Email team about assignment
                </label>
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

        <table {...getTableProps()} className="table txt-dark-grey">
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
        </table>
      </div>

      <div className="mb-3 mt-3">
        <button onClick={() => {}} type="button" className="btn btn-primary">
          Save Job
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

export default ClientJobAddForm;
