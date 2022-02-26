import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Truncate from 'react-truncate';

import * as quotesActions from '../../../store/actions/quotes.actions';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { endpoints } from 'common/config';
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

interface IQuote {
  id: string;
  title: string;
  description: string;
  quoteFor: any;
  property: any;
  lineItems: any[];
  status: { status: string; reason: string; updatedAt: string };
  total: string;
  createdAt: string;
  updatedAt: string;
}

const quoteStatusOptions = [
  { label: 'PENDING', value: 'PENDING' },
  { label: 'ACCEPTED', value: 'ACCEPTED' },
  { label: 'REJECTED', value: 'REJECTED' },
  { label: 'ARCHIVED', value: 'ARCHIVED' },
  { label: 'CHANGE_REQUESTED', value: 'CHANGE_REQUESTED' }
];

const QuotesList = (props: any) => {
  const navigate = useNavigate();
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

        props.actions.fetchQuotes({ q: query, offset: offset, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete quote');
    }
  };

  useEffect(() => {
    props.actions.fetchQuotes({ q: query, offset: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(
        props.itemList.data?.rows.map((row: IQuote) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          quoteFor: row.quoteFor,
          lineItems: row.lineItems,
          status: row.status,
          total: '$123456',
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

  const handleQuotesSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  const handleStatusChange = async (id: string, status: { label: string; value: string }, reason: string) => {
    await props.actions.updateQuoteStatus({ id, status: status.value, reason: reason });

    props.actions.fetchQuotes({ q: query, offset: offset, limit: itemsPerPage });
  };

  /**
   * Generate Quote
   *
   * @param quote
   * @returns JSX
   */
  const generateRatings = (quote: IQuote) => {
    return (
      <div>
        <strong>${quote.lineItems.reduce((sum, current) => (sum += current.quantity * current.unitPrice), 0)}</strong>
        {/* <div>
        <span className="row ms-2">
          <box-icon
            name="star"
            size="xs"
            type="solid"
            color="#F5E059"
          />
          <box-icon
            name="star"
            size="xs"
            type="solid"
            color="#F5E059"
          />
          <box-icon
            name="star"
            size="xs"
            type="solid"
            color="#F5E059"
          />
        </span>
      </div> */}
      </div>
    );
  };

  const Status = ({ row }: { row: IQuote }) => {
    const [statusChangeInProgress, setStatusChangeInProgress] = useState('');

    return (
      <div style={{ minWidth: '150px' }}>
        <SelectField
          label=""
          options={quoteStatusOptions}
          value={{ label: row.status.status, value: row.status.status }}
          placeholder="All"
          handleChange={(selected: { label: string; value: string }) => {
            if (selected.value === 'REJECTED' || selected.value === 'CHANGE_REQUESTED') setStatusChangeInProgress(selected.value);
            else handleStatusChange(row.id, selected, '');
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
        Header: 'CLIENT NAME',
        accessor: (row: IQuote) => {
          return (
            <div>
              <div>
                {row.quoteFor?.firstName} {row.quoteFor?.lastName}
              </div>
              <div>
                {row.quoteFor?.phoneNumber} / {row.quoteFor?.email}
              </div>
            </div>
          );
        }
      },
      {
        Header: 'QUOTE INFO',
        accessor: (row: IQuote) => {
          return (
            <div className="Pointer" onClick={() => navigate(`/dashboard/quotes/${row.id}`)}>
              <div>
                <strong>{row.title}</strong>
              </div>
              <div>
                <i>
                  <Truncate lines={1} ellipsis={<span>...</span>}>
                    {row.description}
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
        Header: 'CREATED DATE',
        accessor: (row: IQuote) => {
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
        accessor: (row: IQuote) => <Status row={row} />
      },
      {
        Header: 'TOTAL',
        accessor: (row: IQuote) => generateRatings(row)
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: IQuote) => (
          <div className="dropdown">
            <a href="void(0)" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded" />
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => navigate(row.id)}>
                <a className="dropdown-item">View Detail</a>
              </li>
              <li onClick={() => navigate(row.id + '/edit')}>
                <a className="dropdown-item">Edit</a>
              </li>
              <li onClick={() => setDeleteInProgress(row.id)}>
                <a className="dropdown-item">Delete</a>
              </li>
            </ul>
          </div>
        )
      }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: quotes });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3 className="extra">Quotes</h3>
        </div>
        <div className="col">
          <button onClick={() => navigate(endpoints.admin.quotes.add)} type="button" className="btn btn-primary d-flex float-end">
            New quotes
          </button>
        </div>
        <label className="txt-grey">{quotes.length} quotes</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-4">
            <InputField label="Search" placeholder="Search quotes" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col row">
            <div className="col">
              <SelectField label="Due" placeholder="All" />
            </div>
            <div className="col">
              <SelectField label="Sort" placeholder="total" />
            </div>
            <div className="col">
              <SelectField label="Type" placeholder="All" />
            </div>
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
