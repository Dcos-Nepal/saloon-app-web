import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";

interface IClient {
  name: string;
  address: string;
  contact: string;
  status: string;
}

const WorkerList = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<IClient[]>([]);

  useEffect(() => {
    setClients([
      {
        name: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        contact: "(+ 101) 123123123",
        status: "Active",
      },
      {
        name: "MOCK Neal Johar",
        address: "NY, US 13 TOMAKIN, New South Wales(NSW), 2537",
        contact: "(+ 101) 532123",
        status: "Inactive",
      },
      {
        name: "MOCK S. Johar",
        address: "LA, US 12 TOMAKIN, New South Wales(NSW), 2537",
        contact: "(+ 101) 321113",
        status: "Active",
      },
      {
        name: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        contact: "(+ 101) 123123123",
        status: "Active",
      },
      {
        name: "MOCK Adam Anuwa",
        address: "WS, US 12 TOMAKIN, New South Wales(NSW), 2537",
        contact: "(+ 101) 32112333",
        status: "In progress",
      },
      {
        name: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        contact: "(+ 101) 123123123",
        status: "Active",
      },
    ]);
  }, []);

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: "WORKER NAME",
        accessor: "name",
      },
      {
        Header: "ADDRESS",
        accessor: "address",
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
              className={`status ${row.status === "Inactive"
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
          <div className="dropdown">
            <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded"></box-icon>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li><a className="dropdown-item" href="#">View Detail</a></li>
              <li><a className="dropdown-item" href="#">Edit</a></li>
              <li><a className="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: clients });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3>Workers</h3>
        </div>
        <div className="col">
          <button
            onClick={() => {
              navigate(endpoints.admin.worker.add);
            }}
            type="button"
            className="btn btn-primary d-flex float-end"
          >
            New Worker
          </button>
        </div>
        <label className="txt-grey">{clients.length} clients</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col">
            <InputField
              label="Search"
              placeholder="Search clients"
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
      </div>
    </>
  );
};

export default WorkerList;
