import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as clientsActions from "../../../store/actions/clients.actions";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { Loader } from "common/components/atoms/Loader";
import debounce from 'lodash/debounce';

interface IClient {
  name: string;
  address: string;
  contact: string;
  status: string;
}

const ClientsList = (props: any) => {
  const navigate = useNavigate();
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [clients, setClients] = useState<IClient[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    props.actions.fetchClients({q:query, roles: 'CLIENT', page: offset, limit: itemsPerPage });
  }, [itemsPerPage, offset, props.actions, query]);

  useEffect(() => {
    if (props.clients?.data?.rows) {
      setClients(props.clients.data?.rows
        .map((row: any) => ({
          name: `${row.firstName} ${row.lastName}`,
          address: row?.address ? `${row.address?.street1}, ${row.address?.street2}, ${row.address?.city}, ${row.address?.state}, ${row.address?.postalCode}, ${row.address?.country}` : "Address not added!",
          contact: row.phoneNumber,
          status: 'some status'
        }))
      );
      setPageCount(Math.ceil(props.clients.data.totalCount / itemsPerPage))
    }
  }, [itemsPerPage, props.clients]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage)
  };

  const handleClientSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce(handleClientSearch, 300)
  , []);

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: "CLIENT NAME",
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
          <h3>Clients</h3>
        </div>
        <div className="col">
          <button
            onClick={() => {
              navigate(endpoints.admin.client.add);
            }}
            type="button"
            className="btn btn-primary d-flex float-end"
          >
            New client
          </button>
        </div>
        <label className="txt-grey">Total {query ? `${clients.length} Search results found!` : `${pageCount} clients`}</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col">
            <InputField
              label="Search"
              placeholder="Search clients"
              className="search-input"
              onChange={debouncedChangeHandler}
            />
          </div>
          <div className="col row">
            <div className="col">
              <SelectField label="Sort" options={[{label:"Name", value: "name"}, {label:"Phone Number", value: "number"}]} placeholder="Sort by" />
            </div>
            <div className="col">
              <SelectField label="Filters" options={[{label:"All results", value: "all"}, {label:"Phone Number", value: "number"}]} placeholder="All results" />
            </div>
          </div>
          {!clients.length ? <div className="row pt-2 m-1 rounded-top bg-light">
            No results found!
          </div> : null}
          <table {...getTableProps()} className="table txt-dark-grey">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="rt-head"
                >
                  <th>SN</th>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} scope="col">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="rt-tbody">
              {rows.map((row, index) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()} className={`rt-tr-group`}>
                    <td><strong>#{index + 1 + (offset*itemsPerPage)}</strong></td>
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
        <div className="row pt-2 m-1 rounded-top">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return ({
    clients: state.clients.clients,
    isLoading: state.clients.isLoading
  })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchClients: (payload: any) => {
      dispatch(clientsActions.fetchClients(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientsList);
