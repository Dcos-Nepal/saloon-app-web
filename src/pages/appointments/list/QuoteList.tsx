import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
import { EyeIcon, PencilIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import { DateTime } from 'luxon';
import { calculateJobDuration } from 'utils/timer';
import ReactTooltip from 'react-tooltip';

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

const quoteStatusOptions = [
  { label: 'WAITING', value: 'WAITING' },
  { label: 'IN PROCESS', value: 'IN_PROGRESS' },
  { label: 'COMPLETED', value: 'COMPLETED' }
];

const AppointmentList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [query, setQuery] = useState('');
  const [queryDate, setQueryDate] = useState('');
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

  const handleQuotesSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  const handleQuotesFilter = (event: any) => {
    const query = event.target.value;
    setQueryDate(query);
  };

  const handleStatusChange = async (id: string, data: any) => {
    await props.actions.updateQuoteStatus({ id, data });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  const Status = ({ row }: { row: IQuote }) => {
    const [statusChangeInProgress, setStatusChangeInProgress] = useState('');

    return (
      <div style={{ minWidth: '150px' }}>
        <SelectField
          isDisabled={row.status.name === 'COMPLETED'}
          label=""
          options={quoteStatusOptions}
          value={{ label: row.status.name, value: row.status.name }}
          placeholder="All"
          handleChange={(selected: { label: string; value: string }) => {
            handleStatusChange(row.id, {
              status: {
                name: selected.value,
                duration: calculateJobDuration({
                  startDate: new Date(row.status.date).toISOString(),
                  endDate: new Date().toISOString()
                })
              }
            })
          }}
          helperComponent={<div className="">{''}</div>}
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

  const Timer = (props: any) => {
    const [timer, setTimer] = useState(calculateJobDuration({
      startDate: new Date(props.date).toISOString(),
      endDate: new Date().toISOString()
    }));
  
    useEffect(() => {
      const inte = setInterval(() => {
        setTimer(calculateJobDuration({
          startDate: new Date(props.date).toISOString(),
          endDate: new Date().toISOString()
        }));
      }, 1000);

      return () => {
        clearInterval(inte);
      } 
    }, [props.status]);

    return <div style={{'fontSize': 18, fontWeight: '600'}}>{timer}</div>;
  }

  const columns: Column<IQuote>[] = useMemo(
    () => [
      {
        Header: 'APPOINTMENT INFO',
        accessor: (row: IQuote) => {
          return (
            <div onClick={() => navigate('/dashboard/clients/' + row.customer.id)}>
              <div>{row.customer?.fullName || ' Not Entered '}</div>
              <div>{row.customer?.phoneNumber}</div>
            </div>
          );
        }
      },
      {
        Header: 'SESSION INFO',
        accessor: (row: IQuote) => {
          return (<div>{row.session || ' Not Entered '}</div>);
        }
      },
      {
        Header: 'WAITING TIME',
        accessor: (row: IQuote) => {
          return row.status.name === 'COMPLETED'
            ? <div>Completed on: <br/> <span style={{'fontSize': 16, 'fontWeight': 600}}>{DateTime.fromISO(row.status.date).toFormat('yyyy-MM-dd HH:mm a')}</span></div>
            : <>Currently {(row.status.name).toLowerCase().split('_').join(' ')} <br/> <Timer date={row.status.date} status={row.status.name}/></>;
        }
      },
      {
        Header: 'APPOINTMENT DATE',
        accessor: (row: IQuote) => {
          return (<>
            Scheduled for: <br/>
            <div style={{'fontSize': 16, 'fontWeight': 600}}>{row.appointmentDate} {DateTime.fromISO(row.appointmentTime).toFormat('h:mm a') }</div>
            {row.type === 'TREATMENT' ? <div className='text-primary'>Services: {row.services.join(', ')}</div> : null}
          </>);
        }
      },
      {
        Header: 'Notes',
        accessor: ((row: IQuote) => {
          return <>
            <a data-tip data-for='global'> <button className='btn btn-secondary'>Hover Me</button></a>
            <ReactTooltip id='global' aria-haspopup='true' role='example'>
            <p>{row.notes}</p>
            </ReactTooltip>
          </>
        })
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
              {(currentUser.role === 'ADMIN' || currentUser.role === 'SHOP_ADMIN') ? (
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
    const quoteQuery: { q?: string; appointmentDate?: string; createdBy?: string;} = {}

    if (currentUser.role === 'SHOP_ADMIN') {
      quoteQuery.createdBy = currentUser.id;
    }

    if (queryDate) {
      quoteQuery.appointmentDate = queryDate;
    }

    if (query) {
      quoteQuery.q = query;
    }

    props.actions.fetchQuotes({ ...quoteQuery, page: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, query, queryDate, currentUser.id, currentUser.role]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(
        props.itemList.data?.rows
          .filter((row: any) => props?.appointmentType ? props.appointmentType?.toLowerCase() === row.type?.toLowerCase() :  true)
          .map((row: IQuote) => ({
            id: row.id,
            customer: row.customer,
            notes: row.notes,
            services: row?.services,
            status: row.status,
            type: row.type,
            session: row.session,
            appointmentDate: row.appointmentDate,
            appointmentTime: row.appointmentTime,
            createdAt: row.createdAt,
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
          <div className="col-8">
            <InputField label="Search" placeholder="Search appointments" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col-4">
            <InputField type="date" label="Search" placeholder="Search Date" className="search-input" onChange={handleQuotesFilter} />
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
      dispatch(quotesActions.updateQuoteStatus(payload.id, payload.data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentList);
