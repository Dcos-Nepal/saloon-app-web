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
import { EyeIcon, PencilIcon, PersonAddIcon, SyncIcon, TrashIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import { deleteUserApi } from 'services/customers.service';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { getCurrentUser } from 'utils';
import SelectField from 'common/components/form/Select';
import { getClientTags } from 'data';
import { IOption } from 'common/types/form';
import { addPackageClientApi, fetchPackageClientsApi, updatePackageClientApi } from 'services/package-client.service';
import AddPackageClient from '../add/AddPackageClient';

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
  const [itemsPerPage] = useState(15);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [clients, setClients] = useState<IClient[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [currUser,] = useState(getCurrentUser());
  const [selectedTags, setSelectedTags] = useState<string>('');
  const [packageClient, setPackageClient] = useState<any>(null);

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
      setPackageClient(null);
    } catch (ex) {
      toast.error('Failed to update Package Client');
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
              <div className='col-8'>
                <div className="cursor-pointer" onClick={() => navigate(pinterpolate(endpoints.admin.client.detail, { id: row._id }))}>
                  <div>{row.name}</div>
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
                  <div>{new Date(row.packagePaidDate).toLocaleString()}</div>
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
            </ul>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: clients });

  const fetchPackageClients = async (itemsPerPage: any, offset: any,  query: any) => {
    const clients = await fetchPackageClientsApi({
      q: query,
      page: offset,
      limit: itemsPerPage
    });

    if (clients?.data?.data.data.rows) {
      setClients(
        clients.data?.data.data.rows.map((row: any) => ({
          _id: row._id,
          name: row.customer.fullName || `${row?.customer.firstName} ${row?.customer.lastName}`,
          paymentType: row.paymentType,
          description: row.description,
          isApproved: row.isApproved,
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
        <div className="col-9 d-flex flex-row">
          <h3 className="extra">Package Clients</h3>
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
            onClick={() => { setPackageClient({ customer: { _id: '' } }) }}
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
