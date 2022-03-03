import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Truncate from 'react-truncate';

import * as invoicesActions from '../../../src/store/actions/invoices.actions';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { endpoints } from 'common/config';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';

import Modal from 'common/components/atoms/Modal';
import { deleteInvoiceApi } from 'services/invoice.service';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { EyeIcon, PencilIcon, ReportIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';

interface IInvoice {
  id: string;
  subject: string;
  clientMessage: string;
  dueOnReceipt: boolean;
  isPaid: boolean;
  isIssued: boolean;
  invoiceFor: any;
  refJob?: any;
  refVisit?: any;
  refProperty?: any;
  lineItems: any[];
  total: string;
  createdAt: string;
  updatedAt: string;
}

const invoiceStatusOptions = [
  { label: 'PENDING', value: 'PENDING' },
  { label: 'PAID', value: 'PAID' }
];

const InvoicesList = (props: any) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const currentUser = getCurrentUser();
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');

  const deleteInvoiceHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteInvoiceApi(deleteInProgress);
        toast.success('Invoice deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchInvoices({ q: query, offset: offset, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete invoice');
    }
  };

  useEffect(() => {
    const clientQuery: { invoiceFor?: string; } = {}

    if (currentUser.role === 'CLIENT') clientQuery.invoiceFor = currentUser.id;

    props.actions.fetchInvoices({ q: query, ...clientQuery, offset: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query, currentUser.id, currentUser.role]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setInvoices(
        props.itemList.data?.rows.map((row: IInvoice) => ({
          ...row,
          createdAt: new Date(row.createdAt).toDateString(),
          updatedAt: new Date(row.updatedAt).toDateString()
        }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleInvoicesSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleInvoicesSearch, 300), []);

  const handleStatusChange = async (id: string, status: { label: string; value: string }) => {
    // Prepare Object
    const reqObj = {
      isPaid: status.value === 'PAID' ? true : false,
      paidDate: new Date().toISOString()
    };
    await props.actions.updateInvoiceStatus(id, reqObj);
  };

  /**
   * Generate Invoice
   *
   * @param invoice
   * @returns JSX
   */
  const generateRatings = (invoice: IInvoice) => {
    return (
      <div>
        <strong>${invoice.lineItems.reduce((sum, current) => (sum += current.quantity * current.unitPrice), 0)}</strong>
      </div>
    );
  };

  const columns: Column<IInvoice>[] = useMemo(
    () => [
      {
        Header: 'CLIENT NAME',
        accessor: (row: IInvoice) => {
          return (
            <div>
              <div>
                {row.invoiceFor?.firstName} {row.invoiceFor?.lastName}
              </div>
              <div>
                {row.invoiceFor?.phoneNumber} / {row.invoiceFor?.email}
              </div>
            </div>
          );
        }
      },
      {
        Header: 'QUOTE INFO',
        accessor: (row: IInvoice) => {
          return (
            <div className="cursor-pointer" onClick={() => navigate(`/dashboard/invoices/${row.id}`)}>
              <div>
                <strong>{row.subject}</strong>
              </div>
              <div>
                <i>
                  <Truncate lines={1} ellipsis={<span>...</span>}>
                    {row.clientMessage}
                  </Truncate>
                </i>
              </div>
              <div>
                <span className="badge rounded-pill bg-secondary">Total Line Items ({row.lineItems.length})</span>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'DUE DATE',
        accessor: (row: IInvoice) => {
          return (
            <div style={{ width: '150px' }}>
              <div>
                <strong>{row.updatedAt}</strong>
              </div>
              <div>{row.createdAt}</div>
            </div>
          );
        }
      },
      {
        Header: 'STATUS',
        accessor: (row: IInvoice) => {
          if (props.isEditable) {
            return (
              <div style={{ minWidth: '150px' }}>
                <SelectField
                  label=""
                  options={invoiceStatusOptions}
                  placeholder="All"
                  value={row.isPaid ? { label: 'PAID', value: 'PAID' } : { label: 'PENDING', value: 'PENDING' }}
                  handleChange={(selected: { label: string; value: string }) => handleStatusChange(row.id, selected)}
                />
              </div>
            );
          }

          return <div>{row.isPaid ? 'PAID' : row.isIssued ? 'PENDING' : 'ALL'}</div>;
        }
      },
      {
        Header: 'TOTAL',
        accessor: (row: IInvoice) => generateRatings(row)
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: IInvoice) => (
          <div className="dropdown">
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded" />
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className="pointer" onClick={() => navigate('/dashboard/invoices/' + row.id)}>
                <span className="dropdown-item cursor-pointer">
                  <EyeIcon /> View Detail
                </span>
              </li>
              {(currentUser.role === 'ADMIN') ? (
                <>
                  <li className="pointer" onClick={() => navigate('/dashboard/invoices/' + row.id + '/edit')}>
                    <span className="dropdown-item cursor-pointer">
                      <PencilIcon /> Edit
                    </span>
                  </li>
                  <li className="pointer" onClick={() => setDeleteInProgress('/dashboard/invoices/' + row.id)}>
                    <span className="dropdown-item cursor-pointer">
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
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: invoices });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3 className="extra">Invoices</h3>
        </div>
        <div className="col">
          <button onClick={() => navigate('/dashboard/invoices/' + endpoints.admin.invoices.add)} type="button" className="btn btn-primary d-flex float-end">
            <ReportIcon className='mt-1' />&nbsp;New Invoice
          </button>
        </div>
        <label className="txt-grey">{invoices.length} invoices</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-12">
            <InputField label="Search" placeholder="Search invoices" className="search-input" onChange={handleSearch} />
          </div>
          {!invoices.length ? (
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
      </div>

      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteInvoiceHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    itemList: state.invoices.itemList,
    isLoading: state.invoices.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchInvoices: (payload: any) => {
      dispatch(invoicesActions.fetchInvoices(payload));
    },
    updateInvoiceStatus: (id: string, payload: any) => {
      dispatch(invoicesActions.updateInvoice(id, payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesList);
