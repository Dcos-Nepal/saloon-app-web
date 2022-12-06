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
import { ClockIcon, EyeIcon, PencilIcon, PersonAddIcon, PlusIcon, SyncIcon, TrashIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import { deleteUserApi } from 'services/customers.service';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { getCurrentUser } from 'utils';
import AppointmentAddForm from 'pages/appointments/add';
import { createQuotesApi } from 'services/appointments.service';
import DummyImage from '../../../assets/images/dummy.png';
import { addVisitApi, updateVisitApi } from 'services/visits.service';
import AddBookingForm from 'pages/bookings/AddBooking';
import SelectField from 'common/components/form/Select';
import { getClientTags } from 'data';
import { IOption } from 'common/types/form';

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
  const [addSchedule, setAddSchedule] = useState<boolean>(false);
  const [currUser,] = useState(getCurrentUser());
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string>('')

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
  }
  
  const handleRefresh = () => {
    const clientQuery: { createdBy?: string; } = {};

    if (currUser.role === 'SHOP_ADMIN') clientQuery.createdBy = currUser.id;

    props.actions.fetchClients({
      q: query,
      ...clientQuery,
      page: offset,
      limit: itemsPerPage
    });
  }

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleClientSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  /**
   * Handles line item Save
   * @param data 
   */
  const addNewBooking = async (data: any) => {
    try {
        await addVisitApi(data);
        toast.success('Booking added successfully');
        setBookingDetails(null);
    } catch (ex) {
        toast.error('Failed to add Booking');
    }
  };

  /**
   * Update Booking Information
   * @param id string
   * @param data any
   */
  const updateBooking = async (id: string, data: any) => {
      try {
          await updateVisitApi(id, data);
          toast.success('Booking updated successfully');
          setBookingDetails(null);
      } catch (ex) {
          toast.error('Failed to update Booking');
      }
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
              <div className='col-4 cursor-pointer' onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row._id }))}>
                {row.photo ? (
                  <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + row.photo} style={{'width': '72px'}}>
                    <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
              </div>
              <div className='col-8'>
                <div className="cursor-pointer" onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row._id }))}>
                  <div><b>{row.name}</b> ({row.gender})</div>
                  <div>Date of Birth: <b>{row.dob ? row.dob as string : '-- --'}</b></div>
                  <div>Address: <b>{row.address || 'Address not added.'}</b></div>
                  <small>Created at: {new Date(row.createdAt).toLocaleString()}</small>
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
        Header: '  ',
        accessor: (row: any) => (
          <div className='mt-3 btn btn-primary btn-small' onClick={() => {setAddSchedule(row)}}>
            <ClockIcon /> Schedule
          </div>
        )
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: any) => (
          <div className="dropdown mt-4">
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
              <li onClick={() => {setAddSchedule(row)}}>
                <span className="dropdown-item pointer"><ClockIcon /> Schedule</span>
              </li>
              <li onClick={() => {navigate('/dashboard/orders/add?client=' + row._id)}}>
                <span className="dropdown-item pointer"><PlusIcon /> Add Order</span>
              </li>
              <li onClick={() => {setBookingDetails({ customer: {_id: row._id }})}}>
                <span className="dropdown-item pointer"><PlusIcon /> Add Booking</span>
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
      setAddSchedule(false);
    } catch (ex) {
      toast.error('Failed to add appointment');
    }
  };

  useEffect(() => {
    const currUser = getCurrentUser();
    const clientQuery: { createdBy?: string; } = {}

    if (currUser.role === 'WORKER') clientQuery.createdBy = currUser.id;

    props.actions.fetchClients({
      q: query,
      ...clientQuery,
      tags: selectedTags,
      roles: 'CLIENT',
      page: offset,
      limit: itemsPerPage
    });
  }, [itemsPerPage, offset, props.actions, query, selectedTags]);

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
        {(currUser.role.includes('SHOP_ADMIN' || 'ADMIN')) ? <label className="txt-grey">Total {query ? `${clients.length} search results found!` : `${props?.clients?.data?.totalCount || 0} clients`}</label> : null}
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-9">
            <InputField label="Search" placeholder="Search clients" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col-3">
            <SelectField
              label="Tags"
              name="tags"
              isMulti={false}
              value={selectedTags}
              options={getClientTags().filter((tag) => tag.isActive)}
              handleChange={(selectedTag: IOption) => {
                setSelectedTags(selectedTag ? selectedTag.value.toString() : '');
              }}
            />
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

      <Modal isOpen={!!addSchedule} onRequestClose={() => setAddSchedule(false)}>
        <AppointmentAddForm client={addSchedule} closeModal={() => setAddSchedule(false)} saveHandler={scheduleHandler} />
      </Modal>

      <Modal isOpen={!!bookingDetails} onRequestClose={() => setBookingDetails(null)}>
        <AddBookingForm closeModal={() => setBookingDetails(null)}
        saveHandler={addNewBooking}
        updateHandler={updateBooking}
        bookingDetails={bookingDetails}/>
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
