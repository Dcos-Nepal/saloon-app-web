import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Column, useTable } from 'react-table';
import { useEffect, useMemo, useState } from 'react';
import Truncate from 'react-truncate';

import ServiceAdd from '../add';
import ServiceEdit from '../edit';
import Modal from 'common/components/atoms/Modal';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import DeleteConfirm from 'common/components/DeleteConfirm';
import * as servicesActions from 'store/actions/services.actions';
import { PencilIcon, TrashIcon } from '@primer/octicons-react';
import { updateServiceApi, deleteServiceApi, addServiceApi } from 'services/services.service';;

interface IProps {
  actions: { fetchServices: (query: any) => any };
  isLoading: boolean;
  lineItems: any;
}

const ServicesList = (props: IProps) => {
  const [itemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [lineItems, setServices] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [editServiceFor, setEditServiceFor] = useState<any | null>(null);
  const [addServiceOpen, setAddServiceOpen] = useState<boolean>(false);

  const editServiceHandler = async (data: any) => {
    try {
      await updateServiceApi({ ...data, _id: editServiceFor?._id });
      toast.success('Service updated successfully');
      setEditServiceFor(null);
      props.actions.fetchServices({ q: search, page, limit: itemsPerPage });
    } catch (ex) {
      toast.error('Failed to update service');
    }
  };

  const deleteServiceHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteServiceApi(deleteInProgress);
        toast.success('Service deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchServices({ q: search, page, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete service');
    }
  };

  useEffect(() => {
    props.actions.fetchServices({ q: search, page, limit: itemsPerPage });
  }, [page, search, itemsPerPage, props.actions]);

  useEffect(() => {
    if (props.lineItems?.data?.rows) {
      setServices(props.lineItems.data?.rows);
      setPageCount(Math.ceil(props.lineItems.data.totalCount / itemsPerPage));
    }
  }, [props.lineItems, itemsPerPage]);

  const columns: Column<any>[] = useMemo(
    () => [
      {
        Header: 'SERVICE NAME',
        accessor: 'name'
      },
      {
        Header: 'DESCRIPTION',
        accessor: ((row: any) => {
          return (<Truncate lines={1} ellipsis={<span>...</span>}>
            {row.description}
          </Truncate>)
        })
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
              <li onClick={() => {setEditServiceFor(row)}}>
                <span className="dropdown-item pointer"><PencilIcon /> Edit</span>
              </li>
              <li onClick={() => setDeleteInProgress(row._id)}>
                <span className="dropdown-item pointer"><TrashIcon /> Delete</span>
              </li>
            </ul>
          </div>
        )
      }
    ],
    []
  );

  /**
   * Handles Service Search
   * @param event
   */
  const handleServicesSearch = (event: any) => {
    const query = event.target.value;
    setSearch(query);
  };

  /**
   * Handles Page Click
   * @param event
   */
  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setPage(selectedPage + 1);
  };

  /**
   * Handles service Save
   * @param data 
   */
  const addServiceHandler = async (data: any) => {
    try {
      await addServiceApi(data);
      toast.success('Service added successfully');
      setAddServiceOpen(false);
      props.actions.fetchServices({ q: search, page, limit: itemsPerPage });
    } catch (ex) {
      toast.error('Failed to add service');
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: lineItems });

  return (
    <>
      <div className="row d-flex flex-row">
        <div className="col ">
          <h3 className="extra">Provided Services</h3>
        </div>
        <div className="col d-flex flex-row align-items-center justify-content-end">
          <button onClick={() => setAddServiceOpen(true)} type="button" className="btn btn-primary d-flex float-end">
            Create Service
          </button>
        </div>
        <label className="txt-grey">Total {props?.lineItems?.data?.totalCount || 0} Services</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col-12">
            <InputField label="Search" placeholder="Search services" className="search-input" onChange={handleServicesSearch} />
          </div>
          <table {...getTableProps()} className="table txt-dark-grey">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                  <th>#NO.</th>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} scope="col" className={column.render('Header') === 'DESCRIPTION' ? 'col-4' : ''}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="rt-tbody">
              {props.isLoading ? <tr><td colSpan={6}><Loader isLoading={props.isLoading} /></td></tr> : null}
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
        {lineItems.length ? (
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
      <Modal isOpen={!!addServiceOpen} onRequestClose={() => setAddServiceOpen(false)}>
        <ServiceAdd closeModal={() => setAddServiceOpen(false)} saveHandler={addServiceHandler} />
      </Modal>
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteServiceHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
      <Modal isOpen={!!editServiceFor} onRequestClose={() => setEditServiceFor(null)}>
        <ServiceEdit saveHandler={editServiceHandler} closeModal={() => setEditServiceFor(null)} lineItem={editServiceFor} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: { services: any; isLoading: boolean }) => {
  return {
    lineItems: state.services.items,
    isLoading: state.services.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchServices: (payload: any) => {
      dispatch(servicesActions.fetchServices(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ServicesList);
