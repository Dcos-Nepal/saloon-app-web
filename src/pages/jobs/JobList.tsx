import _, { debounce } from 'lodash';
import { rrulestr } from 'rrule';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import pinterpolate from 'pinterpolate';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Feedback from './Feedback';
import CompleteJob from './CompleteJob';
import { endpoints } from 'common/config';
import Modal from 'common/components/atoms/Modal';
import InputField from 'common/components/form/Input';
import { completeJobApi } from 'services/jobs.service';
import DeleteConfirm from 'common/components/DeleteConfirm';
import * as jobsActions from '../../store/actions/job.actions';
import { deleteJobApi, provideFeedbackApi } from 'services/jobs.service';
import { Loader } from 'common/components/atoms/Loader';
import { CheckIcon, EyeIcon, NoteIcon, PencilIcon, TasklistIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import Truncate from 'react-truncate';

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
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [completeJobFor, setCompleteJobFor] = useState<any | null>(null);
  const [provideFeedbackFor, setProvideFeedbackFor] = useState<any | null>(null);
  const currentUser = getCurrentUser();

  const completeJobHandler = async (data: any) => {
    try {
      await completeJobApi(completeJobFor?._id, data);
      toast.success('Job completed successfully');
      setCompleteJobFor(null);
      props.actions.fetchJobs({ q: search, page, limit: itemsPerPage });
    } catch (ex) {
      toast.error('Failed to complete job');
    }
  };

  const deleteJobHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteJobApi(deleteInProgress);
        toast.success('Job deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchJobs({ q: search, page, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete job');
    }
  };

  useEffect(() => {
    const jobQuery: { jobFor?: string; team?: string } = {};

    if (currentUser.role === 'CLIENT') jobQuery.jobFor = currentUser.id;
    if (currentUser.role === 'WORKER') jobQuery.team = currentUser.id;

    props.actions.fetchJobs({ q: search, ...jobQuery, page, limit: itemsPerPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        Header: 'TITLE/INSTRUCTION',
        accessor: (row: any) => {
          return (
            <div>
              <div className="txt-bold">{row.title}</div>
              <div className="txt-grey">
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  {row.instruction}
                </Truncate>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'CLIENT',
        accessor: 'jobFor'
      },
      {
        Header: 'JOB ADDRESS',
        accessor: (row: any) => {
          return (
            <div>
              {row.property?.street1}, {row.property?.street2}, {row.property?.city}, {row.property?.state}, {row.property?.postalCode}, {row.property?.country}
            </div>
          );
        }
      },
      {
        Header: 'JOB SCHEDULE',
        accessor: 'schedule'
      },
      {
        Header: 'REQUIRE INVOICING?',
        accessor: (row: any) => <div>{!row.isCompleted ? 'Yes' : 'No'}</div>
      },
      {
        Header: 'Total',
        accessor: (row: any) => <strong>${row.total}</strong>
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
              {currentUser.role === 'CLIENT' ? (
                <li onClick={() => setCompleteJobFor(row)}>
                  <span className="dropdown-item pointer">
                    <CheckIcon /> Mark as Complete
                  </span>
                </li>
              ) : null}
              {currentUser.role === 'WORKER' ? (
                <li onClick={() => setProvideFeedbackFor(row)}>
                  <span className="dropdown-item pointer">
                    <NoteIcon /> Provide Feedback
                  </span>
                </li>
              ) : null}
              <li onClick={() => navigate(pinterpolate(endpoints.admin.worker.detail, { id: row._id }))}>
                <span className="dropdown-item pointer">
                  <EyeIcon /> View Detail
                </span>
              </li>

              {((currentUser.role === 'WORKER' || currentUser.role === 'CLIENT') && currentUser.id === row?.createdBy) || currentUser.role === 'ADMIN' ? (
                <>
                  <li onClick={() => navigate(pinterpolate(endpoints.admin.jobs.edit, { id: row._id }))}>
                    <span className="dropdown-item pointer">
                      <PencilIcon /> Edit
                    </span>
                  </li>
                  <li onClick={() => setDeleteInProgress(row._id)}>
                    <span className="dropdown-item pointer">
                      <TrashIcon /> Delete
                    </span>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: jobs });

  /**
   * Handles job search
   * @param event
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleJobsSearch = useCallback(
    debounce((event: any) => {
      const query = event.target.value;
      setSearch(query);
    }, 300),
    []
  );

  /**
   * Handles page click
   * @param event
   */
  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setPage(selectedPage + 1);
  };

  /**
   * Handles feedback on the Jon
   * @param data
   */
  const feedbackHandler = async (data: any) => {
    try {
      await provideFeedbackApi(provideFeedbackFor._id, data);
      toast.success('Feedback provided successfully');
      setProvideFeedbackFor(null);
      props.actions.fetchJobs({ q: search, page, limit: itemsPerPage });
    } catch (ex) {
      toast.error('Failed to provide feedback');
    }
  };

  return (
    <>
      <div className="row d-flex flex-row">
        <div className="col ">
          <h3 className="extra">Jobs</h3>
        </div>
        <div className="col d-flex flex-row align-items-center justify-content-end">
          <button onClick={() => navigate(endpoints.admin.jobs.add)} type="button" className="btn btn-primary d-flex float-end">
            <TasklistIcon className="mt-1" />
            &nbsp;Create a Job
          </button>
        </div>
        <label className="txt-grey">Total {props?.jobs?.data?.totalCount || 0} Jobs</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col-12">
            <InputField label="Search" placeholder="Search jobs" className="search-input" onChange={handleJobsSearch} />
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
              <Loader isLoading={props.isLoading} />
              {rows.map((row, index) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()} className="rt-tr-group">
                    <td>
                      <strong>#{index + 1 + (page - 1) * itemsPerPage}</strong>
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
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
        ) : null}
      </div>
      <Modal isOpen={provideFeedbackFor} onRequestClose={() => setProvideFeedbackFor(null)}>
        <Feedback closeModal={() => setProvideFeedbackFor(null)} job={provideFeedbackFor} provideFeedback={feedbackHandler} />
      </Modal>
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteJobHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
      <Modal isOpen={completeJobFor} onRequestClose={() => setCompleteJobFor(null)}>
        <CompleteJob completeJob={completeJobHandler} closeModal={() => setCompleteJobFor(null)} job={completeJobFor} />
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
