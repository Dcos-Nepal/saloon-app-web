import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactPaginate from 'react-paginate';
import * as workersActions from "../../../store/actions/workers.actions";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import { connect } from "react-redux";
import { Loader } from "common/components/atoms/Loader";
import debounce from "lodash/debounce";

interface IClient {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  status: string;
}

const WorkerList = (props: any) => {
  const navigate = useNavigate();
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0)
  const [workers, setWorkers] = useState<IClient[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    props.actions.fetchWorkers({ q:query, roles: 'WORKER', page: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query]);

  useEffect(() => {
    if (props.workers?.data?.rows) {
      setWorkers(props.workers.data?.rows
        .map((row: any) => ({
          name: `${row.firstName} ${row.lastName}`,
          address: row?.address ? `${row.address.street1}, ${row.address.street2}, ${row.address.city}, ${row.address.state}, ${row.address.postalCode}, ${row.address.country}` : "Address not added!",
          phoneNumber: row.phoneNumber,
          email: row.email,
          status: 'some status'
        }))
      );
      setPageCount(Math.ceil(props.workers.data.totalCount / itemsPerPage));
    }
  }, [itemsPerPage, props.workers]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1)
  };

  const handleWorkerSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce(handleWorkerSearch, 300)
  , []);

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: "WORKER NAME",
        accessor: (row: any) => {
          return (<div>
            <div><b>{row.name}</b></div>
            <small>{row.address || 'Address not added.'}</small>
          </div>);
        }
      },
      {
        Header: "CONTACT",
        accessor: (row: any) => {
          return (<div>
            <div>Phone: <b>{row.phoneNumber}</b></div>
            <small>Email: <b>{row.email}</b></small>
          </div>);
        }
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
    useTable({ columns, data: workers });

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
        <label className="txt-grey">Total {query ? `${workers.length} Search results found!` : `${pageCount} workers`}</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col">
            <InputField
              label="Search"
              placeholder="Search workers"
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
                  <tr {...row.getRowProps()} className="rt-tr-group">
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
    workers: state.workers.workers,
    isLoading: state.workers.isLoading
  })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchWorkers: (payload: any) => {
      dispatch(workersActions.fetchWorkers(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerList);
