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
import { ClockIcon, EyeIcon, PencilIcon, PersonAddIcon, SyncIcon, TrashIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import { deleteUserApi } from 'services/customers.service';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { getCurrentUser } from 'utils';
import AppointmentAddForm from 'pages/appointments/add';
import { createQuotesApi } from 'services/appointments.service';
import { DateTime } from 'luxon';
import DummyImage from '../../../assets/images/dummy.png';

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
  const [addLineItemOpen, setAddLineItemOpen] = useState<boolean>(false);

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
  
  const handleRefresh = () => {
    const currUser = getCurrentUser();
    const clientQuery: { createdBy?: string; } = {};

    if (currUser.role === 'SHOP_ADMIN') clientQuery.createdBy = currUser.id;

    props.actions.fetchClients({
      q: query,
      ...clientQuery,
      page: offset,
      limit: itemsPerPage
    });
  }

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
          name: row.fullName || `${row?.firstName} ${row?.lastName}`,
          email: row.email,
          address: row?.address,
          contact: row.phoneNumber,
          photo: row.photo,
          gender: row.gender,
          dob: row.dateOfBirth,
          status: row.auth?.email?.verified,
          createdAt: row.createdAt,
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
            <div className='row'>
              <div className='col-4'>
                {row.photo ? (
                  <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + row.photo} style={{'width': '72px'}}>
                    <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
              </div>
              <div className='col-8'>
                <div className="cursor-pointer" onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row._id }))}>
                  <div><b>{row.name}</b> ({row.gender})</div>
                  <div>Date of Birth: <b>{row.dob ? row.dob as string : 'N/A'}</b></div>
                  <div>Address: <b>{row.address || 'Address not added.'}</b></div>
                </div>
              </div>
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
                {!row.contact ? <label><i>[Phone Number not added]</i></label> : null}
              </div>
              <div>
                Email: <b>{row.email}</b>
                {!row.email ? <label><i>[Email not added]</i></label> : null}
              </div>
            </div>
          );
        }
      },
      {
        Header: 'CREATED DATE',
        accessor: (row: any) => (
          <label className="txt-grey ms-2">
            {new Date(row.createdAt).toLocaleString()}
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
              <li onClick={() => {setAddLineItemOpen(row)}}>
                <span className="dropdown-item pointer"><ClockIcon /> Schedule</span>
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

  /**
   * Handles Appointment Save
   * @param data 
   */
  const scheduleHandler = async (data: any) => {
    try {
      await createQuotesApi(data);
      toast.success('Appointment added successfully');
      setAddLineItemOpen(false);
    } catch (ex) {
      toast.error('Failed to add appointment');
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-9 d-flex flex-row">
          <h3 className="extra">Clients</h3>
        </div>
        <div className="col-3 d-flex flex-row-reverse">
          <div
            onClick={() => handleRefresh()}
            className="btn btn-secondary d-flex float-end"
          >
            <SyncIcon className='mt-1' />&nbsp;Refresh
          </div>
          &nbsp;&nbsp;
          <div
            onClick={() => { navigate(endpoints.admin.client.add);}}
            className="btn btn-primary d-flex float-end"
          >
            <PersonAddIcon className='mt-1' />&nbsp;New client
          </div>
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

      {/* Modals */}
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteClientHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
      <Modal isOpen={!!addLineItemOpen} onRequestClose={() => setAddLineItemOpen(false)}>
        <AppointmentAddForm client={addLineItemOpen} closeModal={() => setAddLineItemOpen(false)} saveHandler={scheduleHandler} />
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
