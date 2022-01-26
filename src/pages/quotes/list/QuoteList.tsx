import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";

import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import Modal from "common/components/atoms/Modal";
import { endpoints } from "common/config";
import ReactPaginate from "react-paginate";

interface IQuote {
  quoteNumber: string;
  client: string;
  address: string;
  createdDate: string;
  title: string;
  total: string;
}

const QuotesList = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<IQuote[]>([]);

  useEffect(() => {
    setQuotes([
      {
        quoteNumber: "#1",
        client: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        createdDate: "Aug 19, 2021",
        title: "Window cleaning",
        total: "$110.00",
      },
      {
        quoteNumber: "#2",
        client: "MOCK Neal Johar",
        address: "NY, US 13 TOMAKIN, New South Wales(NSW), 2537",
        createdDate: "Aug 19, 2021",
        title: "Window cleaning",
        total: "$110.00",
      },
      {
        quoteNumber: "#12",
        client: "MOCK S. Johar",
        address: "LA, US 12 TOMAKIN, New South Wales(NSW), 2537",
        createdDate: "Aug 19, 2021",
        title: "Window cleaning",
        total: "$110.00",
      },
      {
        quoteNumber: "#3",
        client: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        createdDate: "Aug 19, 2021",
        title: "Window cleaning",
        total: "$110.00",
      },
      {
        quoteNumber: "#4",
        client: "MOCK Adam Anuwa",
        address: "WS, US 4 TOMAKIN, New South Wales(NSW), 2537",
        createdDate: "Aug 19, 2021",
        title: "Window cleaning",
        total: "$110.00",
      },
      {
        quoteNumber: "#5",
        client: "MOCK Adam Johar",
        address: "NY, US 12 TOMAKIN, New South Wales(NSW), 2537",
        createdDate: "Aug 19, 2021",
        title: "Window cleaning",
        total: "$110.00",
      },
    ]);
  }, []);

  const columns: Column<IQuote>[] = useMemo(
    () => [
      {
        Header: "#NO.",
        accessor: "quoteNumber",
      },
      {
        Header: "CLIENT NAME",
        accessor: "client",
      },
      {
        Header: "ADDRESS",
        accessor: "address",
      },
      {
        Header: "CREATED DATE",
        accessor: "createdDate",
      },
      {
        Header: "TITLE",
        accessor: "title",
      },
      {
        Header: "TOTAL",
        accessor: (row: any) => (
          <div>
            {row.total}
            <span className="ms-2">
              <box-icon
                name="star"
                size="xs"
                type="solid"
                color="#F5E059"
              ></box-icon>
              <box-icon
                name="star"
                size="xs"
                type="solid"
                color="#F5E059"
              ></box-icon>
              <box-icon
                name="star"
                size="xs"
                type="solid"
                color="#F5E059"
              ></box-icon>
            </span>
          </div>
        ),
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
              <li onClick={() => navigate(endpoints.admin.quotes.detail)}>
                <a className="dropdown-item" href="#">
                  View Detail
                </a>
              </li>
              <li onClick={() => navigate(endpoints.admin.quotes.edit)}>
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
    useTable({ columns, data: quotes });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3>Quotes</h3>
        </div>
        <div className="col">
          <button
            onClick={() => navigate(endpoints.admin.quotes.add)}
            type="button"
            className="btn btn-primary d-flex float-end"
          >
            New quotes
          </button>
        </div>
        <label className="txt-grey">{quotes.length} quotes</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col-4">
            <InputField
              label="Search"
              placeholder="Search quotes"
              className="search-input"
            />
          </div>
          <div className="col row">
            <div className="col">
              <SelectField label="Due" placeholder="All" />
            </div>
            <div className="col">
              <SelectField label="Sort" placeholder="total" />
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
        <div className="row pt-2 m-1 rounded-top">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={1}
            onPageChange={()=>{}}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </>
  );
};

export default QuotesList;
