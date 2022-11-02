import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import luxonPlugin from '@fullcalendar/luxon2';
import EventActions from 'store/actions/events.actions';
import { IEvent } from 'common/types/events';
import Modal from 'common/components/atoms/Modal';
import useMountedRef from 'common/hooks/is-mounted';
import { fetchJobSchedule } from 'store/actions/schedule.actions';
import { Loader } from 'common/components/atoms/Loader';
import { ClockIcon } from '@primer/octicons-react';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { getCurrentUser } from 'utils';
import { toast } from 'react-toastify';
import ScheduleEventDetail from './EventDetail';
import { DateTime } from 'luxon';
import AddBookingForm from './AddBooking';
import { addVisitApi } from 'services/visits.service';

const WorkSchedule = (props: any) => {
  const isMounted = useMountedRef();
  const [events, setEvents] = useState([]);
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();
  const [addLineItemOpen, setAddLineItemOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  /**
   * Handles event click
   * ------------------------------------------------------------------------------------------
   * @param clickInfo
   */
  const handleEventClick = (clickInfo: any) => {
    if (isMounted) {
      setShowEventDetail(clickInfo.event);
    }
  };

  /**
   * Handlers that initiate reads/writes via the 'action' props
   * ------------------------------------------------------------------------------------------
   * @param rangeInfo
   */
  const handleDates = (rangeInfo: any) => {
    const currUser = getCurrentUser();

    if (!currUser) return toast.error('No User Found!');

    setDateRange({
      startDate: rangeInfo.start.toISOString(),
      endDate: rangeInfo.end.toISOString(),
    });

    props.fetchJobSchedule({
      startDate: rangeInfo.start.toISOString(),
      endDate: rangeInfo.end.toISOString(),
      limit: (currUser.role === ('ADMIN' || 'SHOP_ADMIN') ? 1000 : 300)
    });
  };

  /**
   * Renders Event Deails
   * @returns JSX
   */
  const renderEventContent = (eventInfo: any) => {
    const meta = eventInfo.event.extendedProps?.meta;

    // If we want to show completed visits
    if (!props.completedVisible && meta?.status?.status === 'COMPLETED') {
      return null;
    }

    // Else only show in-complete visits
    const backgroundClass = meta?.status?.status !== 'COMPLETED'
      ? 'cfc-event cfc-event-bg-blue'
      : ' cfc-event cfc-event-bg-green';

    eventInfo.backgroundColor = '#edebe6';
    eventInfo.textColor = meta?.status?.status !== 'COMPLETED' ? 'grey' : 'white';

    return (
      <div className={backgroundClass}>
        <div title={eventInfo.event.title}>
          <small>{meta.type}</small><br/>
          <div>{eventInfo.event.title} - {meta?.fullName}</div>
        </div>
        <div>
          <ClockIcon size={12} /> {new Date(eventInfo.event.start).toLocaleTimeString()}
        </div>
      </div>
    );
  }

  /**
   * Handles line item Save
   * @param data 
   */
  const addNewBooking = async (data: any) => {
    try {
      await addVisitApi(data);
      toast.success('Booking added successfully');
      setAddLineItemOpen(false);

      // Fetching the updated calendar events
      props.fetchJobSchedule({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        limit:  100
      });
    } catch (ex) {
      toast.error('Failed to add Booking');
    }
  };
  
  useEffect(() => {
    if (props.schedules?.rows?.length > 0) {
      const mappedEvents = props.schedules.rows.map((event: any) => {
        return {
          title: `Booking for ${event.fullName}`,
          start: DateTime.fromISO(event.bookingDate).toFormat('yyyy-MM-dd hh:mm'),
          end: DateTime.fromISO(event.bookingDate).toFormat('yyyy-MM-dd hh:mm'),
          meta: {...event}
        };
      });

      setEvents(mappedEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schedules?.rows?.length]);

  return (
    <>
      <SideNavbar active="Schedule" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row d-flex flex-row mb-3">
          <div className="col-6 d-flex flex-row">
            <h3 className="extra">Booking Calendar</h3>
          </div>
          <div className="col-2">
            <div className="form-group mt-3 d-flex float-end">
              <input type="checkbox" className="mt-1" id="toggle-completed" checked={props.completedVisible} onChange={props.toggleCompleted}></input>
              <label htmlFor="toggle-completed" className='pt-1'>&nbsp;Toggle Completed</label>
            </div>
          </div>
          <div className="col-2">
            <div className="form-group mt-3 d-flex float-end">
              <input type="checkbox" className="mt-1" id="toggle-weekends" checked={props.weekendsVisible} onChange={props.toggleWeekends}></input>
              <label htmlFor="toggle-weekends" className='pt-1'>&nbsp;Toggle Weekends</label>
            </div>
          </div>
          <div className='col-2 pt-2'>
            <button onClick={() => setAddLineItemOpen(true)} type="button" className="btn btn-primary d-flex float-end">
              Add Booking
            </button>
          </div>
          <label className="txt-grey">
            <ClockIcon /> Scheduled Bookings
          </label>
        </div>
        <div className="card pt-4">
          <div style={{ position: 'relative' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin, luxonPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              timeZone="Asia/Kathmandu"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={props.weekendsVisible}
              datesSet={handleDates}
              displayEventEnd={true}
              displayEventTime={true}
              events={events}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
            />
            <Loader isLoading={props.isLoading} />
          </div>
        </div>

        {/* Modals Section */}
        <Modal isOpen={!!showEventDetail} onRequestClose={() => setShowEventDetail(null)}>
          {!!showEventDetail ? (
            <ScheduleEventDetail  event={showEventDetail} closeModal={() => setShowEventDetail(null)} />
          ) : (<></>)}
        </Modal>
        <Modal isOpen={!!addLineItemOpen} onRequestClose={() => setAddLineItemOpen(false)}>
          <AddBookingForm closeModal={() => setAddLineItemOpen(false)} saveHandler={addNewBooking} />
        </Modal>
        <Footer />
      </div>
    </>
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
      weekendsVisible: state.weekendsVisible,
      completedVisible: state.completedVisible,
      schedules: state.schedules.schedules
    };
  };
}

export default connect(mapStateToProps, { ...EventActions, fetchJobSchedule })(WorkSchedule);
