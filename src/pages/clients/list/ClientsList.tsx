import pinterpolate from 'pinterpolate';
import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as clientsActions from '../../../store/actions/clients.actions';

import { endpoints } from 'common/config';
import InputField from 'common/components/form/Input';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';
import { AlertIcon, CheckCircleIcon, EyeIcon, PencilIcon, PersonAddIcon, TrashIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import { deleteUserApi } from 'services/users.service';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { getCurrentUser } from 'utils';

interface IClient {
  name: string;
  email: string;
  address: string;
  contact: string;
  status: boolean;
  updatedAt: string;
}

const ClientsList = (props: any) => {
  const navigate = useNavigate();
  const [itemsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [clients, setClients] = useState<IClient[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');

  const deleteClientHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteUserApi(deleteInProgress);
        toast.success('Client deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchClients({
          q: query,
          roles: 'CLIENT',
          page: offset,
          limit: itemsPerPage
        });
      }
    } catch (ex) {
      toast.error('Failed to delete client');
    }
  };

  useEffect(() => {
    const currUser = getCurrentUser();
    const clientQuery: { createdBy?: string; } = {}

    if (currUser.role === 'WORKER') clientQuery.createdBy = currUser.id;

    props.actions.fetchClients({
      q: query,
      ...clientQuery,
      roles: 'CLIENT',
      page: offset,
      limit: itemsPerPage
    });
  }, [itemsPerPage, offset, props.actions, query]);

  useEffect(() => {
    if (props.clients?.data?.rows) {
      setClients(
        props.clients.data?.rows.map((row: any) => ({
          name: `${row.firstName} ${row.lastName}`,
          email: row.email,
          address: row?.address
            ? `${row.address?.street1}, ${row.address?.street2}, ${row.address?.city}, ${row.address?.state}, ${row.address?.postalCode}, ${row.address?.country}`
            : 'Address not added!',
          contact: row.phoneNumber,
          status: row.auth?.email?.valid,
          updatedAt: row.updatedAt,
          _id: row._id
        }))
      );
      setPageCount(Math.ceil(props.clients.data.totalCount / itemsPerPage));
    }
  }, [itemsPerPage, props.clients]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleClientSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleClientSearch, 300), []);

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: 'CLIENT NAME',
        accessor: (row: any) => {
          return (
            <div>
              <div>
                <b>{row.name}</b>
              </div>
              <small>{row.address || 'Address not added.'}</small>
            </div>
          );
        }
      },
      {
        Header: 'CONTACT',
        accessor: (row: any) => {
          return (
            <div>
              <div>
                Phone: <b>{row.contact}</b>
              </div>
              <small>
                Email: <b>{row.email}</b>
              </small>
            </div>
          );
        }
      },
      {
        Header: 'STATUS',
        accessor: (row: any) => (
          <label className="txt-grey ms-2">
            {row.status ? <CheckCircleIcon className="txt-green" /> : <AlertIcon className="txt-red" />} &nbsp;{' '}
            {row.updatedAt ? new Date(row.updatedAt).toLocaleString() : new Date(row.createdAt).toLocaleString()}
          </label>
        )
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
              <li onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row._id }))}>
                <span className="dropdown-item cursor-pointer" >
                  <EyeIcon /> View Detail
                </span>
              </li>
              <li onClick={() => navigate(pinterpolate(endpoints.admin.client.edit, { id: row._id }))}>
                <span className="dropdown-item cursor-pointer">
                  <PencilIcon /> Edit
                </span>
              </li>
              <li onClick={() => setDeleteInProgress(row._id)}>
                <span className="dropdown-item cursor-pointer">
                  <TrashIcon /> Delete
                </span>
              </li>
            </ul>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: clients });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3 className="extra">Clients</h3>
        </div>
        <div className="col">
          <button
            onClick={() => {
              navigate(endpoints.admin.client.add);
            }}
            type="button"
            className="btn btn-primary d-flex float-end"
          >
            <PersonAddIcon className='mt-1' />&nbsp;New client
          </button>
        </div>
        <label className="txt-grey">Total {query ? `${clients.length} search results found!` : `${props?.clients?.data?.totalCount || 0} clients`}</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-12">
            <InputField label="Search" placeholder="Search clients" className="search-input" onChange={handleSearch} />
          </div>
          {!clients.length ? (
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
                    <tr {...row.getRowProps()} className={`rt-tr-group`}>
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
        {clients.length ? (
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
        <DeleteConfirm onDelete={deleteClientHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    clients: state.clients.clients,
    isLoading: state.clients.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchClients: (payload: any) => {
      dispatch(clientsActions.fetchClients(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientsList);
