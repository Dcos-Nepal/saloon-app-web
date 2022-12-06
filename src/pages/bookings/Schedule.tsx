import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import luxonPlugin from '@fullcalendar/luxon2';
import eventActions from 'store/actions/events.actions';
import { IEvent } from 'common/types/events';
import Modal from 'common/components/atoms/Modal';
import useMountedRef from 'common/hooks/is-mounted';
import { fetchJobSchedule } from 'store/actions/schedule.actions';
import { Loader } from 'common/components/atoms/Loader';
import { ClockIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import { toast } from 'react-toastify';
import ScheduleEventDetail from './EventDetail';
import { DateTime } from 'luxon';

const BookingSchedule = (props: any) => {
  const isMounted = useMountedRef();
  const [events, setEvents] = useState([]);
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();

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

  const handleEventEdit = (eventDetails: any) => {
    props.bookingHandler(eventDetails);
  }

  /**
   * Handlers that initiate reads/writes via the 'action' props
   * ------------------------------------------------------------------------------------------
   * @param rangeInfo
   */
  const handleDates = (rangeInfo: any) => {
    const currUser = getCurrentUser();

    if (!currUser) return toast.error('No User Found!');

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

    if (!meta) {return <div/>}

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
          <small>{meta?.type}</small><br/>
          <div>{eventInfo.event.title} - {meta?.customer ? meta?.customer.fullName : meta?.fullName}</div>
        </div>
        <div>
          <ClockIcon size={12} /> {DateTime.fromJSDate(eventInfo.event.start).toFormat('yyyy-MM-dd hh:mm')}
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    if (props.schedules?.rows?.length > 0) {
      const mappedEvents = props.schedules.rows
        .filter((event: any) => event.type === props.type)
        .map((event: any) => {
          console.log(event)
          return {
            title: `Booking for ${event.customer ? event.customer.fullName : event.fullName}`,
            start: DateTime.fromISO(event.status.date).toFormat('yyyy-MM-dd HH:mm'),
            end: DateTime.fromISO(event.status.date).toFormat('yyyy-MM-dd hh:mm'),
            meta: {...event}
          };
        });

      setEvents(mappedEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schedules?.rows?.length]);

  return (
    <div className=''>
      <div className="card pt-4">
        <div style={{ position: 'relative' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, luxonPlugin]}
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

export default connect(mapStateToProps, { ...eventActions, fetchJobSchedule })(BookingSchedule);
