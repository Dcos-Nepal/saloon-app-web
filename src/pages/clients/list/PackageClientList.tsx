import pinterpolate from 'pinterpolate';
import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { endpoints } from 'common/config';
import InputField from 'common/components/form/Input';
import ReactPaginate from 'react-paginate';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';
import { AlertFillIcon, CheckCircleIcon, PencilIcon, PersonAddIcon, SyncIcon, TrashIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { getCurrentUser } from 'utils';
import { addPackageClientApi, deletePackageClientApi, fetchPackageClientsApi, updatePackageClientApi } from 'services/package-client.service';
import AddPackageClient from '../add/AddPackageClient';
import { DateTime } from 'luxon';
import DummyImage from '../../../assets/images/dummy.png';

interface IClient {
  name: string;
  paymentType: string;
  description: string;
  packagePaidDate: string;
  createdAt: string;
  updatedAt: string;
}

const PackageClientList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [itemsPerPage] = useState(15);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [clients, setClients] = useState<IClient[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [currUser,] = useState(getCurrentUser());
  const [packageClient, setPackageClient] = useState<any>(null);

  const deleteClientHandler = async () => {
    try {
      if (deleteInProgress) {
        await deletePackageClientApi(deleteInProgress);
        toast.success('Package Client deleted successfully');
        fetchPackageClients(itemsPerPage, offset, query);
        setDeleteInProgress('');
      }
    } catch (ex) {
      toast.error('Failed to delete client');
    }
  }

  const handleRefresh = () => {
    const clientQuery: { createdBy?: string; } = {};

    if (currUser.role.includes('SHOP_ADMIN' || 'ADMIN')) clientQuery.createdBy = currUser.id;

    fetchPackageClients(itemsPerPage, offset, query);
  }

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleClientSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  const addNewPackageClient = async (data: any) => {
    console.log(data)
    try {
      await addPackageClientApi(data);
      toast.success('Package Client added successfully');
      setPackageClient(null);
      fetchPackageClients(itemsPerPage, offset, query);
    } catch (ex) {
      toast.error('Failed to add package client');
    }
  }

  const updatePackageClient = async (id: string, data: any) => {
    try {
      await updatePackageClientApi(id, data);
      toast.success('Package client updated successfully');
      fetchPackageClients(itemsPerPage, offset, query);
      setPackageClient(null);
    } catch (ex) {
      toast.error('Failed to update Package Client');
    }
  };

  const approvePackageClient = async (id: string, data: any) => {
    try {
      await updatePackageClientApi(id, data);
      toast.success('Package client approved successfully');
      fetchPackageClients(itemsPerPage, offset, query);
      setPackageClient(null);
    } catch (ex) {
      toast.error('Failed to approve Package Client');
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
              <div className='col-4 cursor-pointer' onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row.customer._id }))}>
                {row.customer.photo ? (
                  <object data={process.env.REACT_APP_API + 'v1/customers/avatars/' + row.customer.photo} style={{ 'width': '72px' }}>
                    <img src={DummyImage} alt="Profile Picture" style={{ 'width': '72px' }} />
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{ 'width': '72px' }} />}
              </div>
              <div className='col-8'>
                <div className="cursor-pointer" onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row.customer._id }))}>
                  <div><b>{row.customer.fullName}</b> ({row.customer.gender})</div>
                  <div>Date of Birth: <b>{row.customer.dateOfBirth ? row.customer.dateOfBirth as string : '-- --'}</b></div>
                  <div>Address: <b>{row.customer.address || 'Address not added.'}</b></div>
                  <small>Created at: {new Date(row.customer.createdAt).toLocaleString()}</small>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'Payment Type',
        accessor: (row: any) => {
          return (
            <div className='row'>
              <div className='col-8'>
                <div className="cursor-pointer">
                  <div>{row.paymentType}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'Payment Date',
        accessor: (row: any) => {
          return (
            <div className='row'>
              <div className='col-8'>
                <div className="cursor-pointer">
                  <div>{DateTime.fromISO(row.packagePaidDate).toFormat('yyyy-MM-dd')}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'Is Approved?',
        accessor: (row: any) => {
          return (
            <div className='row'>
              <div className='col-8'>
                <div className="cursor-pointer">
                  <div>{row.isApproved ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'Sessions',
        accessor: (row: any) => {
          return (
            <div className='row'>
              <div className='col-8'>
                <div className="cursor-pointer">
                  <div>{row.noOfSessions}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'Notes',
        accessor: (row: any) => {
          return (
            <div className='row'>
              <div className='col-8'>
                <div className="cursor-pointer">
                  <div>{row.description}</div>
                </div>
              </div>
            </div>
          );
        }
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
              <li onClick={() => setPackageClient({ ...row })}>
                <span className="dropdown-item cursor-pointer">
                  <PencilIcon /> Edit
                </span>
              </li>
              <li onClick={() => setDeleteInProgress(row._id)}>
                <span className="dropdown-item cursor-pointer">
                  <TrashIcon /> Delete
                </span>
              </li>

              {!row.isApproved && currentUser.role.includes('SHOP_ADMIN' || 'ADMIN')
                ? (<li onClick={() => approvePackageClient(row._id, {
                  ...row,
                  customer: row.customer._id,
                  isApproved: true
                })}>
                  <span className="dropdown-item cursor-pointer">
                    <CheckCircleIcon /> Approve
                  </span>
                </li>) : null
              }

              {row.isApproved && currentUser.role.includes('SHOP_ADMIN' || 'ADMIN')
                ? (<li onClick={() => approvePackageClient(row._id, {
                  ...row,
                  customer: row.customer._id,
                  isApproved: false
                })}>
                  <span className="dropdown-item cursor-pointer">
                    <AlertFillIcon /> Reject
                  </span>
                </li>) : null}

            </ul>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: clients });

  const fetchPackageClients = async (itemsPerPage: any, offset: any, query: any) => {
    const clients = await fetchPackageClientsApi({
      q: query,
      page: offset,
      limit: itemsPerPage
    });

    if (clients?.data?.data.data.rows) {
      setClients(
        clients.data?.data.data.rows.map((row: any) => ({
          _id: row._id,
          id: row._id,
          customer: row.customer,
          paymentType: row.paymentType,
          description: row.description,
          isApproved: row.isApproved,
          noOfSessions: row.noOfSessions,
          packagePaidDate: row.packagePaidDate,
        }))
      );
      setPageCount(Math.ceil(props.clients.data?.data.data.totalCount / itemsPerPage));
    }
  }

  useEffect(() => {
    fetchPackageClients(itemsPerPage, offset, query)
  }, [itemsPerPage, offset, props.actions, query]);

  return (
    <>
      <div className="row">
        <div className="col-8 d-flex flex-row">
          <h3 className="extra">Package Clients</h3>
        </div>
        <div className="col-4 d-flex flex-row-reverse">
          <div
            onClick={() => handleRefresh()}
            className="btn btn-secondary d-flex float-end"
          >
            <SyncIcon className='mt-1' />&nbsp;Refresh
          </div>
          &nbsp;&nbsp;
          <div onClick={() => { setPackageClient({ customer: { _id: '' } }) }} className="btn btn-primary d-flex float-end">
            <PersonAddIcon className='mt-1' />&nbsp;Add Package client
          </div>
        </div>
        {(currUser.role.includes('SHOP_ADMIN' || 'ADMIN')) ? <label className="txt-grey">Total {query ? `${clients.length} search results found!` : `${props?.clients?.data?.totalCount || 0} clients`}</label> : null}
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-4">
            <InputField label="Search" placeholder="Search package clients" className="search-input" onChange={handleSearch} />
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

      <Modal isOpen={!!packageClient} onRequestClose={() => setPackageClient(null)}>
        <AddPackageClient
          closeModal={() => setPackageClient(null)}
          saveHandler={addNewPackageClient}
          updateHandler={updatePackageClient}
          packageClient={packageClient}
        />
      </Modal>
    </>
  );
};

export default PackageClientList;
