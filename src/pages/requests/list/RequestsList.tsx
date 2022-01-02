import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import TopNavbar from "common/components/layouts/topNavbar";
import SideNavbar from "common/components/layouts/sideNavbar";
import Footer from "common/components/layouts/footer";

interface IRequest {
  name: string;
  requestDate: string;
  contact: string;
  status: string;
}

const RequestsList = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<IRequest[]>([]);

  useEffect(() => {
    setRequests([
      {
        name: "MOCK Adam Johar",
        requestDate: new Date().toDateString(),
        contact: "(+ 101) 123123123",
        status: "Active",
      },
      {
        name: "MOCK Neal Johar",
        requestDate: new Date().toDateString(),
        contact: "(+ 101) 532123",
        status: "Inactive",
      },
      {
        name: "MOCK S. Johar",
        requestDate: new Date().toDateString(),
        contact: "(+ 101) 321113",
        status: "Active",
      },
      {
        name: "MOCK Adam Johar",
        requestDate: new Date().toDateString(),
        contact: "(+ 101) 123123123",
        status: "Active",
      },
      {
        name: "MOCK Adam Anuwa",
        requestDate: new Date().toDateString(),
        contact: "(+ 101) 32112333",
        status: "In progress",
      },
      {
        name: "MOCK Adam Johar",
        requestDate: new Date().toDateString(),
        contact: "(+ 101) 123123123",
        status: "Active",
      },
    ]);
  }, []);

  const columns: Column<IRequest>[] = useMemo(
    () => [
      {
        Header: "CLIENT NAME",
        accessor: "name",
      },
      {
        Header: "REQUEST DATE",
        accessor: "requestDate",
      },
      {
        Header: "CONTACT",
        accessor: "contact",
      },
      {
        Header: "STATUS",
        accessor: (row: any) => (
          <div>
            <span
              className={`status ${
                row.status === "Inactive"
                  ? "status-red"
                  : row.status === "Active"
                  ? "status-green"
                  : "status-blue"
              }`}
            >
              {row.status}
            </span>
            <label className="txt-grey ms-2">
              {new Date().toLocaleString()}
            </label>
          </div>
        ),
      },
      {
        Header: " ",
        maxWidth: 40,
        accessor: (row: any) => (
          <div>
            <box-icon name="dots-vertical-rounded"></box-icon>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: requests });

  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Requests" />
          <div className="col main-container">
            <div className="row">
              <div className="col d-flex flex-row">
                <h1>Job Requests</h1>
              </div>
              <div className="col">
                <button
                  onClick={() => {
                    navigate(endpoints.admin.requests.list);
                  }}
                  type="button"
                  className="btn btn-primary d-flex float-end"
                >
                  New request
                </button>
              </div>
              <label className="txt-grey">{requests.length} Job Requests</label>
            </div>
            <div className="card">
              <div className="row pt-3 m-1 rounded-top bg-grey">
                <div className="col">
                  <InputField
                    label="Search"
                    placeholder="Search requests"
                    className="search-input"
                  />
                </div>
                <div className="col row">
                  <div className="col">
                    <SelectField label="Sort" placeholder="First name" />
                  </div>
                  <div className="col">
                    <SelectField label="Filters" placeholder="All results" />
                  </div>
                </div>
              </div>
              <table {...getTableProps()} className="table txt-dark-grey">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      className="rt-head"
                    >
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
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestsList;
