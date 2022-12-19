import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import eventActions from 'store/actions/events.actions';
import { IEvent } from 'common/types/events';
import Modal from 'common/components/atoms/Modal';
import { fetchJobSchedule } from 'store/actions/schedule.actions';
import { EyeIcon } from '@primer/octicons-react';
import ScheduleEventDetail from './EventDetail';
import { DateTime } from 'luxon';
import { Column, useTable } from 'react-table';
import EmptyState from 'common/components/EmptyState';
import ReactPaginate from 'react-paginate';
import SelectField from 'common/components/form/Select';
import { getBookingStatus } from 'data';
import InputField from 'common/components/form/Input';

interface  IBooking {
  title: string;
  start: string;
  end: string;
  meta: any;
}

const BookingList = (props: any) => {
  const [itemsPerPage] = useState(50);
  const [offset, setOffset] = useState(1);
  const [events, setEvents] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState('');
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const columns: Column<IBooking>[] = useMemo(
    () => [
      {
        Header: 'TITLE',
        accessor: (row: any) => {
          return (
            <div>{row.title}</div>
          );
        }
      },
      {
        Header: 'BOOKING DATE',
        accessor: (row: any) => {
          return (
            <div>{row.start}</div>
          );
        }
      },
      {
        Header: 'STATUS',
        accessor: (row: any) => (
          <div>{row.meta.status.status}</div>
        )
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: any) => (
          <div className="dropdown mt-1">
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded"></box-icon>
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => setShowEventDetail(row)}>
                <span className="dropdown-item cursor-pointer" >
                  <EyeIcon /> View Detail
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: events });

  const handleEventEdit = (eventDetails: any) => {
    props.bookingHandler(eventDetails);
  }

  useEffect(() => {
    const queryOptions: any  = {
      type: props.type,
      page: offset,
      limit: itemsPerPage
    };

    if (status) {
      queryOptions.status = status;
    }

    props.fetchJobSchedule(queryOptions);
  }, [offset, itemsPerPage, status])
  
  useEffect(() => {
    if (props.schedules?.rows?.length > 0) {
      const mappedEvents = props.schedules.rows
        .map((event: any) => {
          return {
            title: `Booking for ${event.customer ? event.customer.fullName : event.fullName}`,
            start: DateTime.fromISO(event.status.date).toFormat('yyyy-MM-dd hh:mm a'),
            end: DateTime.fromISO(event.status.date).toFormat('yyyy-MM-dd hh:mm a'),
            meta: {...event}
          };
        });

      setPageCount(Math.ceil(props.schedules.totalCount / itemsPerPage));
      setEvents(mappedEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, props.schedules]);

  return (
    <div className=''>
      <div className="row pt-2 m-1 rounded-top bg-grey">
        <div className="col-6">
          <InputField disabled={true} label="Search" placeholder="Search orders by name, phone number" className="search-input" onChange={() => {}} />
        </div>
        <div className="col-3">
          <InputField label="Select Date" disabled={true} value={''} type="date" className="search-input" onChange={() => {}} />
        </div>
        <div className="col-3">
          <SelectField
            label="Filter by Status"
            options={getBookingStatus()}
            placeholder="All"
            handleChange={(selected: { label: string; value: string }) => {
              setStatus(selected ? selected.value : '')
            }}
          />
        </div>
      </div>
      <div>
        {!events.length ? (
            <EmptyState />
          ) : (
            <table {...getTableProps()} className="table txt-dark-grey">
              <thead>
                {headerGroups.map((headerGroup: any) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                    <th>SN</th>
                    {headerGroup.headers.map((column: any) => (
                      <th {...column.getHeaderProps()} scope="col">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="rt-tbody">
                {rows.map((row: any, index: number) => {
                  prepareRow(row);

                  return (
                    <tr {...row.getRowProps()} className={`rt-tr-group`}>
                      <td>
                        <strong>#{index + 1 + (offset - 1) * itemsPerPage}</strong>
                      </td>
                      {row.cells.map((cell: any) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
      {events.length ? (
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
    
      {/* Modals Section */}
      <Modal isOpen={!!showEventDetail} onRequestClose={() => setShowEventDetail(null)}>
        {!!showEventDetail ? (
          <ScheduleEventDetail  event={showEventDetail} closeModal={() => setShowEventDetail(null)} handleEventEdit={handleEventEdit} />
        ) : (<div />)}
      </Modal>
    </div>
  );
};

/**
 * Maps state to the props
 *
 * @returns Object
 */
function mapStateToProps() {
  return (state: any) => {
    return {
      isLoading: state.schedules.isLoading,
      schedules: state.schedules.schedules
    };
  };
}

export default connect(mapStateToProps, { ...eventActions, fetchJobSchedule })(BookingList);
