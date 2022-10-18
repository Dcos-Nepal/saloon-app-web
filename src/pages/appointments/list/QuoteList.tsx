import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Truncate from 'react-truncate';

import * as quotesActions from '../../../store/actions/quotes.actions';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';
import Modal from 'common/components/atoms/Modal';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { deleteQuoteApi } from 'services/quotes.service';
import StatusChangeWithReason from './StatusChangeWithReason';
import { EyeIcon, PencilIcon, SyncIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import { DateTime } from 'luxon';

interface IQuote {
  id: string;
  customer: any;
  notes: string;
  type: any;
  status: any;
  dateTime: any;
  services: any[];
  createdAt: string;
  updatedAt: string;
}

const quoteStatusOptions = [
  { label: 'WAITING', value: 'WAITING' },
  { label: 'IN PROCESS', value: 'IN_PROGRESS' },
  { label: 'COMPLETED', value: 'COMPLETED' }
];

const QuotesList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [query, setQuery] = useState('');
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');

  const deleteQuoteHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteQuoteApi(deleteInProgress);
        toast.success('Quote deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchQuotes({ q: query, page: offset, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete quote');
    }
  };

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  // const handleRefresh = () => {
  //   const quoteQuery: { quoteFor?: string; createdBy?: string;} = {}

  //   if (currentUser.role === 'SHOP_ADMIN') {
  //     quoteQuery.createdBy = currentUser.id;
  //   }

  //   props.actions.fetchQuotes({ q: query, ...quoteQuery, page: offset, limit: itemsPerPage });
  // }

  const handleQuotesSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  const handleStatusChange = async (id: string, status: { label: string; value: string }, reason: string) => {
    await props.actions.updateQuoteStatus({ id, status: status.value });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  const Status = ({ row }: { row: IQuote }) => {
    const [statusChangeInProgress, setStatusChangeInProgress] = useState('');

    return (
      <div style={{ minWidth: '150px' }}>
        <SelectField
          label=""
          options={quoteStatusOptions}
          value={{ label: row.status, value: row.status }}
          placeholder="All"
          handleChange={(selected: { label: string; value: string }) => {
            // if (selected.value === 'COMPLETED') setStatusChangeInProgress(selected.value);
            handleStatusChange(row.id, selected, '');
          }}
          helperComponent={<div className="">{row.status?.reason || ''}</div>}
        />
        <Modal isOpen={!!statusChangeInProgress} onRequestClose={() => setStatusChangeInProgress('')}>
          <StatusChangeWithReason
            id={row.id}
            status={quoteStatusOptions.find((statusLabelValue) => statusLabelValue.value === statusChangeInProgress)}
            onSave={handleStatusChange}
            closeModal={() => setStatusChangeInProgress('')}
          />
        </Modal>
      </div>
    );
  };

  const columns: Column<IQuote>[] = useMemo(
    () => [
      {
        Header: 'Appointment Info',
        accessor: (row: IQuote) => {
          return (
            <div>
              <div>{row.customer?.firstName} {row.customer?.lastName}</div>
              <div>{row.customer?.phoneNumber} / {row.customer?.email}</div>
              {/* <div>Type: {row.type}</div> */}
              {/* <div>Services: {row?.services.join(',') || '-' }</div> */}
              <div>{DateTime.fromISO(row.dateTime).toFormat('yyyy LLL dd hh:mm:ss a')}</div>
              <div>
                <i>
                  <Truncate lines={5} ellipsis={<span>...</span>}>
                    {row.notes}
                  </Truncate>
                </i>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'STATUS',
        accessor: (row: IQuote) => <Status row={row} />
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: IQuote) => (
          <div className="dropdown">
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded" />
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => navigate(row.id)}>
                <span className="dropdown-item cursor-pointer"><EyeIcon /> View Detail</span>
              </li>
              {(currentUser.role === 'ADMIN') ? (
                <>
                  <li onClick={() => navigate(row.id + '/edit')}>
                    <span className="dropdown-item cursor-pointer"><PencilIcon /> Edit</span>
                  </li>
                  <li onClick={() => setDeleteInProgress(row.id)}>
                    <span className="dropdown-item cursor-pointer"><TrashIcon /> Delete</span>
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: quotes });

  useEffect(() => {
    const quoteQuery: { quoteFor?: string; createdBy?: string;} = {}

    if (currentUser.role === 'SHOP_ADMIN') {
      quoteQuery.createdBy = currentUser.id;
    }

    props.actions.fetchQuotes({ q: query, ...quoteQuery, page: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query, currentUser.id, currentUser.role]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(
        props.itemList.data?.rows
          .filter((row: any) => props.appointmentType.toLowerCase() === row.type.toLowerCase())
          .map((row: IQuote) => ({
            id: row.id,
            customer: row.customer,
            notes: row.notes,
            services: row?.services,
            status: row.status,
            type: row.type,
            dateTime: row.dateTime,
            createdAt: new Date(row.createdAt).toDateString(),
            updatedAt: new Date(row.updatedAt).toDateString()
          }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col">
            <h5 className="extra">{props.appointmentType}</h5>
          </div>
        </div>
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-12">
            <InputField label="Search" placeholder="Search quotes" className="search-input" onChange={handleSearch} />
          </div>
          {!quotes.length ? (
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
        {quotes.length ? (
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
        <DeleteConfirm onDelete={deleteQuoteHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    itemList: state.quotes.itemList,
    isLoading: state.quotes.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchQuotes: (payload: any) => {
      dispatch(quotesActions.fetchQuotes(payload));
    },
    updateQuoteStatus: (payload: any) => {
      dispatch(quotesActions.updateQuoteStatus(payload.id, { status: payload.status, reason: payload.reason }));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuotesList);
