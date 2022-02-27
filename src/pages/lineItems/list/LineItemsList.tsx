import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Column, useTable } from 'react-table';
import { useEffect, useMemo, useState } from 'react';

import LineItemAdd from '../add';
import LineItemEdit from '../edit';
import Modal from 'common/components/atoms/Modal';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import DeleteConfirm from 'common/components/DeleteConfirm';
import * as lineItemsActions from 'store/actions/lineItems.actions';
import { deleteLineItemApi, addLineItemApi, updateLineItemApi } from 'services/lineItems.service';
import { PencilIcon, TrashIcon } from '@primer/octicons-react';

interface IProps {
  actions: { fetchLineItems: (query: any) => any };
  isLoading: boolean;
  lineItems: any;
}

const LineItemsList = (props: IProps) => {
  const [itemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [editLineItemFor, setEditLineItemFor] = useState<any | null>(null);
  const [addLineItemOpen, setAddLineItemOpen] = useState<boolean>(false);

  const editLineItemHandler = async (data: any) => {
    try {
      await updateLineItemApi({ ...data, _id: editLineItemFor?._id });
      toast.success('Line Item updated successfully');
      setEditLineItemFor(null);
      props.actions.fetchLineItems({ q: search, page, limit: itemsPerPage });
    } catch (ex) {
      toast.error('Failed to update line Item');
    }
  };

  const deleteLineItemHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteLineItemApi(deleteInProgress);
        toast.success('Line item deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchLineItems({ q: search, page, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete line item');
    }
  };

  useEffect(() => {
    props.actions.fetchLineItems({ q: search, page, limit: itemsPerPage });
  }, [page, search, itemsPerPage, props.actions]);

  useEffect(() => {
    if (props.lineItems?.data?.rows) {
      setLineItems(props.lineItems.data?.rows);
      setPageCount(Math.ceil(props.lineItems.data.totalCount / itemsPerPage));
    }
  }, [props.lineItems, itemsPerPage]);

  const columns: Column<any>[] = useMemo(
    () => [
      {
        Header: 'LINE ITEM NAME',
        accessor: 'name'
      },
      {
        Header: 'DESCRIPTION',
        accessor: 'description'
      },
      {
        Header: 'TAGS',
        accessor: (row: any) =>
          row?.tags?.length ? (
            <div className="">
              {row?.tags.map((tag: string) => (
                <span className="status status-green me-1">{tag}</span>
              ))}
            </div>
          ) : (
            <span className="status status-red">None</span>
          )
      },
      {
        Header: 'REF COST',
        accessor: (row: any) => <div>${(row.refCost || 0).toFixed(2)}</div>
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
              <li onClick={() => {setEditLineItemFor(row)}}>
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
   * Handles Line Item Search
   * @param event
   */
  const handleLineItemsSearch = (event: any) => {
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
   * Handles line item Save
   * @param data 
   */
  const addLineItemHandler = async (data: any) => {
    try {
      await addLineItemApi(data);
      toast.success('Line item added successfully');
      setAddLineItemOpen(false);
      props.actions.fetchLineItems({ q: search, page, limit: itemsPerPage });
    } catch (ex) {
      toast.error('Failed to add line item');
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: lineItems });

  return (
    <>
      <div className="row d-flex flex-row">
        <div className="col ">
          <h3 className="extra">Line Items</h3>
        </div>
        <div className="col d-flex flex-row align-items-center justify-content-end">
          <button onClick={() => setAddLineItemOpen(true)} type="button" className="btn btn-primary d-flex float-end">
            Create Line Item
          </button>
        </div>
        <label className="txt-grey">Total {props?.lineItems?.data?.totalCount || 0} LineItems</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <div className="col-12">
            <InputField label="Search" placeholder="Search line items" className="search-input" onChange={handleLineItemsSearch} />
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
      <Modal isOpen={addLineItemOpen} onRequestClose={() => setAddLineItemOpen(false)}>
        <LineItemAdd closeModal={() => setAddLineItemOpen(false)} saveHandler={addLineItemHandler} />
      </Modal>
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteLineItemHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
      <Modal isOpen={editLineItemFor} onRequestClose={() => setEditLineItemFor(null)}>
        <LineItemEdit saveHandler={editLineItemHandler} closeModal={() => setEditLineItemFor(null)} lineItem={editLineItemFor} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: { lineItems: any; isLoading: boolean }) => {
  return {
    lineItems: state.lineItems.lineItems,
    isLoading: state.lineItems.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchLineItems: (payload: any) => {
      dispatch(lineItemsActions.fetchLineItems(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LineItemsList);
