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
import { ClockIcon, NoteIcon, PlusIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import { DateTime } from 'luxon';
import DummyImage from '../../../assets/images/dummy.png';
import { useNavigate } from 'react-router-dom';
import { addVisitApi, updateVisitApi } from 'services/visits.service';
import AddBookingForm from 'pages/bookings/AddBooking';
import ReactTooltip from 'react-tooltip';

interface IQuote {
  id: string;
  customer: any;
  notes: string;
  type: any;
  status: any;
  session: string;
  interval?: string;
  appointmentDate: string;
  appointmentTime: string;
  services: any[];
  createdAt: string;
  updatedAt: string;
}

const VisitList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [query, setQuery] = useState('');
  const [queryDate, setQueryDate] = useState(DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd'));
  const [itemsPerPage] = useState(15);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [totalData, setTotalData] = useState(0);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

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
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  const columns: Column<IQuote>[] = useMemo(
    () => [
      {
        Header: 'CLIENT INFO',
        accessor: (row: IQuote) => {
          return (
            <div className='row'>
              <div className='col-4'>
                {row.customer.photo ? (
                  <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + row.customer.photo} style={{'width': '72px'}}>
                    <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
              </div>
              <div className='col-8'>
                <div className="cursor-pointer"  onClick={() => navigate('/dashboard/clients/' + row.customer.id )}>
                  <div>{row.customer?.fullName || ' Not Entered '}</div>
                  <div>{row.customer?.phoneNumber}</div>
                  <div>{row.customer?.address}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'APPOINTMENT DATE',
        accessor: (row: IQuote) => {
          return <>
            <div><strong>{row.appointmentDate} {DateTime.fromISO(row.appointmentTime).toFormat('h:mm a') }</strong></div>
            {row.type === 'TREATMENT' ? <div className='text-primary'>Services: {row.services.join(', ')}</div> : null}
            <div>{row?.interval || null}</div>
          </>;
        }
      },
      {
        Header: 'SESSION INFO',
        accessor: (row: IQuote) => {
          return (<div>{row.session || ' -- --'}</div>);
        }
      },
      {
        Header: 'STATUS',
        accessor: (row: IQuote) => (<div>{row.status.name}</div>)
      },
      {
        Header: 'Notes/Reasons',
        accessor: ((row: IQuote) => {
          return (<div className='row'>
            <div className='col-2'>
              <a data-tip data-for='notes'><NoteIcon /></a>
              <ReactTooltip id='notes' aria-haspopup='true'>
                <p>{row.notes}</p>
              </ReactTooltip>
            </div>
          </div>)
        })
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
              <li onClick={() => setDeleteInProgress(row.id)}>
                <span className="dropdown-item cursor-pointer"><TrashIcon /> Delete</span>
              </li>
              <li onClick={() => {setBookingDetails({ customer: {_id: row.customer._id }})}}>
                <span className="dropdown-item pointer"><ClockIcon /> Add Booking</span>
              </li>
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
    const quoteQuery: { q?: string; appointmentDate?: string; createdBy?: string; status?: string} = {};

    if (queryDate) {
      quoteQuery.appointmentDate = queryDate;
    }

    if (query) {
      quoteQuery.q = query;
    }

    quoteQuery.status = 'COMPLETED'

    props.actions.fetchQuotes({ ...quoteQuery, page: offset, limit: itemsPerPage, type: props.appointmentType });
  }, [offset, itemsPerPage, query, queryDate, currentUser.id, currentUser.role, props.appointmentType]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(
        props.itemList.data?.rows
          .map((row: IQuote) => ({
            id: row.id,
            customer: row.customer,
            notes: row.notes,
            services: row?.services,
            session: row.session,
            status: row.status,
            interval: row.interval,
            type: row.type,
            appointmentDate: row.appointmentDate,
            appointmentTime: row.appointmentTime,
            createdAt: new Date(row.createdAt).toDateString(),
            updatedAt: new Date(row.updatedAt).toDateString()
          }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
      setTotalData(props.itemList?.data?.totalCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col">
            <h5 className="extra">Today's Visiting List({totalData})</h5>
          </div>
        </div>
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-8">
            <InputField label="Search" placeholder="Search visits" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col-4">
            <InputField  type="date"  value={queryDate} label="Search" placeholder="Search visits" className="search-input" onChange={handleQuotesFilter} />
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
      {/* Booking Modals */}
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteQuoteHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
      
      <Modal isOpen={!!bookingDetails} onRequestClose={() => setBookingDetails(null)}>
        <AddBookingForm closeModal={() => setBookingDetails(null)}
          saveHandler={addNewBooking}
          updateHandler={updateBooking}
          bookingDetails={bookingDetails}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(VisitList);
