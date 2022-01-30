import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";

import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import Modal from "common/components/atoms/Modal";
import JobAdd from "./JobAdd";
import { endpoints } from "common/config";

interface IClient {
  jobNumber: string;
  client: string;
  address: string;
  schedule: string;
  invoice: string;
  status: string;
}

const InvoicesList = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<IClient[]>([]);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  useEffect(() => {
    setInvoices([
      {
        jobNumber: "#1",
        client: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        schedule: "Aug 19, 2021 Every 2 weeks on Mondays",
        invoice: "Invoice info",
        status: "Active",
      },
      {
        jobNumber: "#2",
        client: "MOCK Neal Johar",
        address: "NY, US 13 TOMAKIN, New South Wales(NSW), 2537",
        schedule: "Aug 19, 2021 Every 2 weeks on Mondays",
        invoice: "Invoice info",
        status: "Inactive",
      },
      {
        jobNumber: "#12",
        client: "MOCK S. Johar",
        address: "LA, US 12 TOMAKIN, New South Wales(NSW), 2537",
        schedule: "Aug 19, 2021 Every 2 weeks on Mondays",
        invoice: "Invoice info",
        status: "Active",
      },
      {
        jobNumber: "#3",
        client: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        schedule: "Aug 19, 2021 Every 2 weeks on Mondays",
        invoice: "Invoice info",
        status: "Active",
      },
      {
        jobNumber: "#4",
        client: "MOCK Adam Anuwa",
        address: "WS, US 4 TOMAKIN, New South Wales(NSW), 2537",
        schedule: "Aug 19, 2021 Every 2 weeks on Mondays",
        invoice: "Invoice info",
        status: "In progress",
      },
      {
        jobNumber: "#5",
        client: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        schedule: "Aug 19, 2021 Every 2 weeks on Mondays",
        invoice: "Invoice info",
        status: "Active",
      },
    ]);
  }, []);

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: "#NO.",
        accessor: "jobNumber",
      },
      {
        Header: "CLIENT",
        accessor: "client",
      },
      {
        Header: "TITLE/ADDRESS",
        accessor: "address",
      },
      {
        Header: "SCHEDULE",
        accessor: "schedule",
      },
      {
        Header: "INVOICING",
        accessor: "invoice",
      },
      {
        Header: "Total",
        accessor: (row: any) => <div>$0.00</div>,
      },
      {
        Header: " ",
        maxWidth: 40,
        accessor: (row: any) => (
          <div className="dropdown">
            <a
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <box-icon name="dots-vertical-rounded"></box-icon>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li
                onClick={() =>
                  navigate(endpoints.admin.invoices.detail)
                }
              >
                <a className="dropdown-item" href="#">
                  View Detail
                </a>
              </li>
              <li onClick={() => navigate(endpoints.admin.invoices.edit)}>
                <a className="dropdown-item" href="#">
                  Edit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Delete
                </a>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: invoices });

  return (
    <>
      <div className="row d-flex flex-row">
        <div className="col ">
          <h3 className="extra">Job Invoices</h3>
        </div>
        <div className="col d-flex flex-row align-items-center justify-content-end">
          <button
            onClick={() => setIsAddJobOpen(true)}
            type="button"
            className="btn btn-secondary d-flex float-end"
          >
            New Invoice
          </button>
        </div>
        <label className="txt-grey">{invoices.length} Invoices</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col-4">
            <InputField
              label="Search"
              placeholder="Search invoices"
              className="search-input"
            />
          </div>
          <div className="col row">
            <div className="col">
              <SelectField label="Status" placeholder="All" />
            </div>
            <div className="col">
              <SelectField label="Sort" placeholder="First name" />
            </div>
            <div className="col">
              <SelectField label="Type" placeholder="All" />
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
            <thead>
              <tr className="rt-head">
                <th colSpan={7} scope="col" className="th-overdue">Overdue Invoices</th>
              </tr>
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
            <thead className="c-th">
              <tr className="rt-head">
                <th colSpan={7} scope="col" className="th-in-progress">In Progress</th>
              </tr>
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
            <thead className="c-th">
              <tr className="rt-head">
                <th colSpan={7} scope="col" className="th-up-coming">Up Coming Invoices</th>
              </tr>
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
      </div>
      <Modal
        isOpen={isAddJobOpen}
        onRequestClose={() => setIsAddJobOpen(false)}
      >
        <JobAdd closeModal={() => setIsAddJobOpen(false)} />
      </Modal>
    </>
  );
};

export default InvoicesList;
