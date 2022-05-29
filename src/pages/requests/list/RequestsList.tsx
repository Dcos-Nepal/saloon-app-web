import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import pinterpolate from 'pinterpolate';
import ReactPaginate from 'react-paginate';
import { useCallback } from 'react';
import { Column, useTable } from 'react-table';
import { useEffect, useMemo, useState } from 'react';

import * as jobReqActions from '../../../store/actions/job-requests.actions';

import InputField from 'common/components/form/Input';
import DeleteConfirm from 'common/components/DeleteConfirm';

import { Loader } from 'common/components/atoms/Loader';
import { useNavigate } from 'react-router-dom';
import { endpoints } from 'common/config';
import debounce from 'lodash/debounce';
import { deleteJobRequestApi } from 'services/job-requests.service';
import Modal from 'common/components/atoms/Modal';
import { EyeIcon, InfoIcon, PencilIcon, TrashIcon } from '@primer/octicons-react';
import EmptyState from 'common/components/EmptyState';
import { getCurrentUser } from 'utils';

interface IRequest {
  name: string;
  title: string;
  requestDate: string;
  contact: string;
  status: string;
}

const RequestsList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [itemsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');

  /**
   * Delete Job Request Handler
   */
  const deleteJobRequestHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteJobRequestApi(deleteInProgress);
        toast.success('Job request deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchJobRequests({ q: query, page: offset, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete job request');
    }
  };

  const handleJobRequestSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleJobRequestSearch, 300), []);

  useEffect(() => {
    const reqQuery: { client?: string; } = {}

    if (currentUser.role === 'CLIENT') reqQuery.client = currentUser.id;

    props.actions.fetchJobRequests({ q: query, ...reqQuery, page: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query, currentUser.role, currentUser.id]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setRequests(
        props.itemList.data?.rows.map((row: any) => ({
          name: row.client,
          title: row.name,
          requestDate: new Date(row.createdAt).toDateString(),
          status: row.status,
          _id: row._id,
          updatedDate: new Date(row.updatedAt).toDateString()
        }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
    }
  }, [itemsPerPage, props.itemList]);

  const columns: Column<IRequest>[] = useMemo(
    () => [
      {
        Header: 'REQUEST TITLE',
        accessor: (row: any) => {
          return (
            <div className="cursor-pointer" onClick={() =>
              navigate(
                pinterpolate(endpoints.admin.requests.detail, {
                  id: row._id
                })
              )
            }>
            {row.title}
            </div>
          );
        }
      },
      {
        Header: 'CLIENT NAME',
        accessor: (row: any) => {
          return (
            <div>
              <div>
                <b>{row.name?.firstName} {row.name?.firstName}</b>
              </div>
              <small>
                {row.name?.email} / {row.name?.phoneNumber}
              </small>
            </div>
          );
        }
      },
      {
        Header: 'REQUEST DATE',
        accessor: 'requestDate'
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
              <li
                onClick={() =>
                  navigate(
                    pinterpolate(endpoints.admin.requests.detail, {
                      id: row._id
                    })
                  )
                }
                className="p-2 pointer dropdown-item"
              >
                <EyeIcon /> View Detail
              </li>
              {((currentUser.role === 'WORKER' || currentUser.role === 'CLIENT') && currentUser.id === row?.createdBy) || currentUser.role === 'ADMIN' ? (
                <>
                  <li
                    className="p-2 pointer dropdown-item"
                    onClick={() =>
                      navigate(
                        pinterpolate(endpoints.admin.requests.edit, {
                          id: row._id
                        })
                      )
                    }
                  >
                    <PencilIcon /> Edit
                  </li>
                  <li onClick={() => setDeleteInProgress(row._id)} className="p-2 pointer dropdown-item">
                    <TrashIcon /> Delete
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: requests });

  return (
    <>
      <div className="row">
        <div className="col">
          <h3 className="extra">Job Requests</h3>
          <p className="text-secondary"><InfoIcon /> List of Job Requests. There are <strong>{requests.length}</strong> Job Requests </p>
        </div>
        <div className="col">
          <button
            onClick={() => {
              navigate(endpoints.admin.requests.add);
            }}
            type="button"
            className="btn btn-primary d-flex float-end"
          >
            New request
          </button>
        </div>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-12">
            <InputField label="Search" placeholder="Search requests" className="search-input" onChange={handleSearch} />
          </div>
          {!requests.length ? (
            <EmptyState />
          ) : (
            <table {...getTableProps()} className="table txt-dark-grey">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                    <th>SN</th>
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
                        <strong>#{index + 1 + (offset - 1) * itemsPerPage}</strong>
                      </td>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {requests.length ? (
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
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteJobRequestHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    itemList: state.jobRequests.itemList,
    isLoading: state.jobRequests.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchJobRequests: (payload: any) => {
      dispatch(jobReqActions.fetchJobRequests(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList);
