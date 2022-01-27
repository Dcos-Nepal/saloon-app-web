import { Column, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";
import * as jobReqActions from "../../../store/actions/job-requests.actions";

import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import { connect } from "react-redux";
import { Loader } from "common/components/atoms/Loader";
import ReactPaginate from "react-paginate";

interface IRequest {
  name: string;
  title: string;
  requestDate: string;
  contact: string;
  status: string;
}

const RequestsList = (props: any) => {
  const [postsPerPage] = useState(10);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0)
  const [requests, setRequests] = useState<IRequest[]>([]);

  useEffect(() => {
    props.actions.fetchJobRequests({ page: offset, limit: postsPerPage });
  }, [offset, postsPerPage, props.actions]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setRequests(props.itemList.data?.rows
        .map((row: any) => ({
          name: row.client,
          title: row.name,
          requestDate: new Date(row.createdAt).toDateString(),
          status: row.status,
          updatedDate: new Date(row.updatedAt).toDateString(),
        }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / postsPerPage));
    }
  }, [postsPerPage, props.itemList]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1)
  };

  const columns: Column<IRequest>[] = useMemo(
    () => [
      {
        Header: "REQUEST TITLE",
        accessor: "title",
      },
      {
        Header: "CLIENT NAME",
        accessor: (row: any) => {
          return (<div>
            <div><b>{row.name.firstName} {row.name.firstName}</b></div>
            <small>{row.name.email} / {row.name.phoneNumber}</small>
          </div>);
        }
      },
      {
        Header: "REQUEST DATE",
        accessor: "requestDate",
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
              {row.updatedDate}
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
    useTable({ columns, data: requests });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3>Job Requests</h3>
        </div>
        <div className="col">
          <button
            // onClick={() => {
            //   navigate(endpoints.admin.requests.list);
            // }}
            type="button"
            className="btn btn-primary d-flex float-end" data-bs-toggle="modal" data-bs-target="#exampleModal"
          >
            New request
          </button>
        </div>
        <label className="txt-grey">{requests.length} Job Requests</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
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
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="was-validated">
                <div className="mb-3">
                  <label htmlFor="validationTextarea" className="form-label">Request Title:</label>
                  <input type="text" className="form-control" placeholder="Required example" required />
                  <div className="invalid-feedback">
                    Please enter a message in the input.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="validationTextarea" className="form-label">Textarea</label>
                  <textarea className="form-control" id="validationTextarea" placeholder="Required example textarea" required />
                  <div className="invalid-feedback">
                    Please enter a message in the textarea.
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="validationFormCheck1" required />
                  <label className="form-check-label" htmlFor="validationFormCheck1">Check this checkbox</label>
                  <div className="invalid-feedback">Example invalid feedback text</div>
                </div>

                <div className="form-check">
                  <input type="radio" className="form-check-input" id="validationFormCheck2" name="radio-stacked" required />
                  <label className="form-check-label" htmlFor="validationFormCheck2">Toggle this radio</label>
                </div>
                <div className="form-check mb-3">
                  <input type="radio" className="form-check-input" id="validationFormCheck3" name="radio-stacked" required />
                  <label className="form-check-label" htmlFor="validationFormCheck3">Or toggle this other radio</label>
                  <div className="invalid-feedback">More example invalid feedback text</div>
                </div>

                <div className="mb-3">
                  <select className="form-select" required aria-label="select example">
                    <option value="">Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <div className="invalid-feedback">Example invalid select feedback</div>
                </div>

                <div className="mb-3">
                  <input type="file" className="form-control" aria-label="file example" required />
                  <div className="invalid-feedback">Example invalid form file feedback</div>
                </div>

                <div className="mb-3">
                  <button className="btn btn-primary" type="submit" disabled>Submit form</button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return ({
    itemList: state.jobRequests.itemList,
    isLoading: state.jobRequests.isLoading
  })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchJobRequests: (payload: any) => {
      dispatch(jobReqActions.fetchJobRequests(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList);
