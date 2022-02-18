import { connect } from "react-redux";
import debounce from "lodash/debounce";
import pinterpolate from "pinterpolate";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import * as workersActions from "../../../store/actions/workers.actions";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import { Loader } from "common/components/atoms/Loader";

interface IClient {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  updatedAt: string;
}

const WorkerList = (props: any) => {
  const navigate = useNavigate();
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [workers, setWorkers] = useState<IClient[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    props.actions.fetchWorkers({
      q: query,
      roles: "WORKER",
      page: offset,
      limit: itemsPerPage,
    });
  }, [offset, itemsPerPage, props.actions, query]);

  useEffect(() => {
    if (props.workers?.data?.rows) {
      setWorkers(
        props.workers.data?.rows.map((row: any) => ({
          _id: row._id,
          name: `${row.firstName} ${row.lastName}`,
          address: row?.address
            ? `${row.address.street1}, ${row.address.street2}, ${row.address.city}, ${row.address.state}, ${row.address.postalCode}, ${row.address.country}`
            : "Address not added!",
          phoneNumber: row.phoneNumber,
          email: row.email,
          status: row.auth.email,
          updatedAt: row.updatedAt,
        }))
      );
      setPageCount(Math.ceil(props.workers.data.totalCount / itemsPerPage));
    }
  }, [itemsPerPage, props.workers]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleWorkerSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce(handleWorkerSearch, 300),
    []
  );

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: "WORKER NAME",
        accessor: (row: any) => {
          return (
            <div>
              <div>
                <b>{row.name}</b>
              </div>
              <small>{row.address || "Address not added."}</small>
            </div>
          );
        },
      },
      {
        Header: "CONTACT",
        accessor: (row: any) => {
          return (
            <div>
              <div>
                Phone: <b>{row.phoneNumber}</b>
              </div>
              <small>
                Email: <b>{row.email}</b>
              </small>
            </div>
          );
        },
      },
      {
        Header: "STATUS",
        accessor: (row: any) => (
          <div>
            <div className={`status ${row.status ? "status-green" : "status-red"}`}>
              {row.status ? "Verified" : " Verification Pending"}
            </div>
            <div className="txt-grey ms-2">
              {row.updatedAt ? new Date(row.updatedAt).toLocaleString() : new Date(row.createdAt).toLocaleString()}
            </div>
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
              <li
                onClick={() =>
                  navigate(
                    pinterpolate(endpoints.admin.worker.detail, {
                      id: row._id,
                    })
                  )
                }
                className="p-2 pointer dropdown-item"
              >
                View Detail
              </li>
              <li
                onClick={() =>
                  navigate(
                    pinterpolate(endpoints.admin.worker.edit, {
                      id: row._id,
                    })
                  )
                }
                className="p-2 pointer dropdown-item"
              >
                Edit
              </li>
              <li className="p-2 pointer dropdown-item">Delete</li>
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
          <h3 className="extra">Workers</h3>
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
        <label className="txt-grey">
          Total{" "}
          {query
            ? `${workers.length} search results found!`
            : `${props?.workers?.data?.totalCount || 0} workers`}
        </label>
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
              <SelectField
                label="Sort"
                options={[
                  { label: "Name", value: "name" },
                  { label: "Phone Number", value: "number" },
                ]}
                placeholder="Sort by"
              />
            </div>
            <div className="col">
              <SelectField
                label="Filters"
                options={[
                  { label: "All results", value: "all" },
                  { label: "Phone Number", value: "number" },
                ]}
                placeholder="All results"
              />
            </div>
          </div>
          <table {...getTableProps()} className="table txt-dark-grey">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
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
                    <td>
                      <strong>
                        #{index + 1 + (offset - 1) * itemsPerPage}
                      </strong>
                    </td>
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
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    workers: state.workers.workers,
    isLoading: state.workers.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchWorkers: (payload: any) => {
      dispatch(workersActions.fetchWorkers(payload));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerList);
