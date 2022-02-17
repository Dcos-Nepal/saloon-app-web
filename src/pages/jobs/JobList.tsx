import _ from 'lodash';
import { rrulestr } from 'rrule';
import { connect } from 'react-redux';
import pinterpolate from 'pinterpolate';
import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useEffect, useMemo, useState } from 'react';

import JobAdd from './JobAdd';
import { endpoints } from 'common/config';
import Modal from 'common/components/atoms/Modal';
import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import * as jobsActions from '../../store/actions/job.actions';
import ReactPaginate from 'react-paginate';

interface IProps {
  actions: { fetchJobs: (query: any) => any };
  isLoading: boolean;
  jobs: any;
}

const JobsList = (props: IProps) => {
  const navigate = useNavigate();
  const [itemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  useEffect(() => {
    props.actions.fetchJobs({ q: search, page, limit: itemsPerPage });
  }, [page, search, itemsPerPage, props.actions]);

  useEffect(() => {
    if (props.jobs?.data?.rows) {
      setJobs(
        props.jobs.data?.rows.map((job: any) => ({
          ...job,
          jobFor: job.jobFor.fullName,
          total: job.lineItems.reduce((total: number, val: any) => total + val.quantity * val.unitPrice, 0),
          schedule: _.startCase(rrulestr(job.primaryVisit.rruleSet).toText())
        }))
      );
      setPageCount(Math.ceil(props.jobs.data.totalCount / itemsPerPage));
    }
  }, [props.jobs, itemsPerPage]);

  const columns: Column<any>[] = useMemo(
    () => [
      {
        Header: 'CLIENT',
        accessor: 'jobFor'
      },
      {
        Header: 'TITLE/ADDRESS',
        accessor: 'property.street1'
      },
      {
        Header: 'JOB SCHEDULE',
        accessor: 'schedule'
      },
      {
        Header: 'REQUIRE INVOICING?',
        accessor: (row: any) => (
          <div>
            {row.remindInvoicing ? 'Yes' : 'No'}
          </div>
        )
      },
      {
        Header: 'Total',
        accessor: 'total'
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: any) => (
          <div className="dropdown">
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded"></box-icon>
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => navigate(pinterpolate(endpoints.admin.worker.detail, { id: row._id }))}>
                <span className="dropdown-item pointer">View Detail</span>
              </li>
              <li onClick={() => navigate(endpoints.admin.jobs.edit)}>
                <span className="dropdown-item pointer">Edit</span>
              </li>
              <li>
                <span className="dropdown-item pointer">Delete</span>
              </li>
            </ul>
          </div>
        )
      }
    ],
    [navigate]
  );

  /**
   * 
   * @param event 
   */
  const handleJobsSearch = (event: any) => {
    const query = event.target.value;
    setSearch(query);
  };

  /**
   * 
   * @param event 
   */
  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setPage(selectedPage + 1);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: jobs });

  return (
    <>
      <div className="row d-flex flex-row">
        <div className="col ">
          <h3 className="extra">Jobs</h3>
        </div>
        <div className="col d-flex flex-row align-items-center justify-content-end">
          <button onClick={() => setIsAddJobOpen(true)} type="button" className="btn btn-secondary d-flex float-end">
            Add Job Quickly
          </button>
          <div>&nbsp;</div>
          <button onClick={() => navigate(endpoints.admin.jobs.add)} type="button" className="btn btn-primary d-flex float-end">
            Create a Job
          </button>
        </div>
        <label className="txt-grey">Total {props?.jobs?.data?.totalCount || 0} Jobs</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col-4">
            <InputField label="Search" placeholder="Search jobs" className="search-input" onClick={handleJobsSearch}/>
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
                 <th>#NO.</th>
                 {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} scope="col">
                      {column.render('Header')}
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
                      <strong>#{(index + 1) + (page - 1) * itemsPerPage}</strong>
                    </td>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {jobs.length ? (
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
        ) : null}
      </div>
      <Modal isOpen={isAddJobOpen} onRequestClose={() => setIsAddJobOpen(false)}>
        <JobAdd closeModal={() => setIsAddJobOpen(false)} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: { jobs: any; isLoading: boolean }) => {
  return {
    jobs: state.jobs.jobs,
    isLoading: state.jobs.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchJobs: (payload: any) => {
      dispatch(jobsActions.fetchJobs(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsList);
