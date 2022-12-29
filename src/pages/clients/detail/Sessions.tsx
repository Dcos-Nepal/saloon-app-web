import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import * as quotesActions from '../../../store/actions/quotes.actions';

import InputField from 'common/components/form/Input';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';
import Modal from 'common/components/atoms/Modal';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { deleteQuoteApi } from 'services/appointments.service';
import { TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import { DateTime } from 'luxon';

interface IQuote {
  id: string;
  customer: any;
  notes: string;
  type: any;
  status: any;
  session: string;
  appointmentDate: string;
  appointmentTime: string;
  services: any[];
  createdAt: string;
  updatedAt: string;
}

const Sessions = (props: any) => {
  const currentUser = getCurrentUser();
  const [query, setQuery] = useState('');
  const [queryDate, setQueryDate] = useState('');
  const [itemsPerPage] = useState(15);
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

  const handleQuotesSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  const handleQuotesFilter = (event: any) => {
    const query = event.target.value;
    setQueryDate(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  const columns: Column<IQuote>[] = useMemo(
    () => [
      {
        Header: 'APPOINTMENT DATE',
        accessor: (row: IQuote) => {
          return <>
            <small><b>{row.type}</b></small><br/>
            <div>{row.appointmentDate} {DateTime.fromISO(row.appointmentTime).toFormat('h:mm a') }</div>
            {row.type === 'TREATMENT' ? <div className='text-primary'>Services: {row.services.join(', ')}</div> : null}
          </>;
        }
      },
      {
        Header: 'SESSION INFO',
        accessor: (row: IQuote) => (<div>{row.session || '--'}</div>)
      },
      {
        Header: 'STATUS',
        accessor: (row: IQuote) => (<div>{row.status.name}</div>)
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
              {currentUser.role.includes('SHOP_ADMIN' || 'ADMIN') ? (
                <li onClick={() => setDeleteInProgress(row.id)}>
                  <span className="dropdown-item cursor-pointer"><TrashIcon /> Delete</span>
                </li>
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
    const quoteQuery: {
        q?: string;
        appointmentDate?: string;
        createdBy?: string;
        status?: string,
        customer?: string;
    } = {}

    if (queryDate) {
      quoteQuery.appointmentDate = queryDate;
    }

    if (query) {
      quoteQuery.q = query;
    }

    if (props.customer) {
        quoteQuery.customer = props.customer;
    }

    props.actions.fetchQuotes({ ...quoteQuery, page: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, query, queryDate, currentUser.id, currentUser.role]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(
        props.itemList.data?.rows
          .map((row: IQuote) => ({
            id: row.id,
            customer: row.customer,
            notes: row.notes,
            services: row?.services,
            status: row.status,
            session: row.session,
            type: row.type,
            appointmentDate: row.appointmentDate,
            appointmentTime: row.appointmentTime,
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
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-8">
            <InputField label="Search" placeholder="Search sessions" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col-4">
            <InputField  type="date" label="Search" className="search-input" onChange={handleQuotesFilter} />
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
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);
