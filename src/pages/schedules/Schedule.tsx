import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import luxonPlugin from '@fullcalendar/luxon2';
import { getHashValues } from 'utils';
import EventActions from 'store/actions/events.actions';
import { IEvent } from 'common/types/events';
import Modal from 'common/components/atoms/Modal';
import useMountedRef from 'common/hooks/is-mounted';
import EditEvent from './EditEvent';
import { fetchJobSchedule } from 'store/actions/schedule.actions';
import { Loader } from 'common/components/atoms/Loader';
import Truncate from 'react-truncate';
import { ClockIcon } from '@primer/octicons-react';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const WorkSchedule = (props: any) => {
  const isMounted = useMountedRef();
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();
  const [events, setEvents] = useState([
    // {
    //   title: "Normal Event",
    //   rrule: "DTSTART:20220101T000000Z\nRRULE:FREQ=DAILY;COUNT=10",
    //   exrule: [{
    //     freq: "DAILY",
    //     count: 2,
    //     dtstart: new Date("2022-01-03")
    //   }]
    // },
    // {
    //   title: "Another Normal Event",
    //   rrule: "DTSTART:20220101T000000Z\nRRULE:FREQ=DAILY;COUNT=10"
    // },
    // {
    //   id: 'k3c7cxvs7dcx7sffsdfad8cx7v9',
    //   title: "Recurring Event",
    //   rrule: "FREQ=DAILY;INTERVAL=1;DTSTART=20201021T100000Z",
    //   duration: "01:30",
    //   exdate: ["20220110T100000Z", "20220113T100000Z"],
    //   metaData: {
    //     'key': 'value'
    //   }
    // },
    // {
    //   id: 'k3c7cxvs7dcsx7s8cx7v9',
    //   title: "Test Event",
    //   rrule: "FREQ=DAILY;INTERVAL=1;DTSTART=20201021T080000Z",
    //   duration: "03:00",
    //   exdate: ["20220112T080000Z", "20220115T080000Z"],
    // },
    // {
    //   id: 'k3c7cxvsasdf7dcx7s8cx7v9',
    //   title: "Normal Event",
    //   start: "2022-01-12T09:00:00+02:00", //On the server this is UTC
    //   end: "22022-01-13T09:00:00+02:00"
    // }
  ]);

  useEffect(() => {
    if (props.schedules?.rows) {
      setEvents(
        props.schedules.rows.map((event: any) => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          rrule: event.rruleSet,
          meta: event
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  /**
   *
   * @param clickInfo
   */
  // const handleDateSelect = (selectInfo: any) => {
  //   let calendarApi = selectInfo.view.calendar
  //   let title = prompt('Please enter a new title for your event')

  //   calendarApi.unselect() // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({ // will render immediately. will call handleEventAdd
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay
  //     }, true) // temporary=true, will get overwritten when reducer gives new events
  //   }
  // }

  /**
   *
   * @param clickInfo
   */
  const handleEventClick = (clickInfo: any) => {
    if (isMounted) {
      setShowEventDetail(clickInfo.event);
    }
    // if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   console.log("Info: ", clickInfo);
    //   if (isMounted) {
    //     setShowEventDetail(clickInfo.event);
    //   }
    //   //clickInfo.event.remove() // will render immediately. will call handleEventRemove
    // }
  };

  // handlers that initiate reads/writes via the 'action' props
  // ------------------------------------------------------------------------------------------
  const handleDates = (rangeInfo: any) => {
    props.fetchJobSchedule();
    // props.requestEvents(rangeInfo.startStr, rangeInfo.endStr)
    //   .catch(reportNetworkError);
  };

  return (
    <>
      <SideNavbar active="Schedule" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row d-flex flex-row mb-3">
          <div className="col ">
            <h3 className="extra">Work Schedule</h3>
          </div>
          <label className="txt-grey">
            Total of <strong>56</strong> Jobs/Visits Scheduled for today
          </label>
        </div>
        <div style={{ position: 'relative' }}>
          <Loader isLoading={props.isLoading} />
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin, luxonPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            timeZone="Australia/Adelaide"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={props.weekendsVisible}
            datesSet={handleDates}
            // select={handleDateSelect}
            displayEventEnd={true}
            displayEventTime={true}
            events={events}
            eventContent={renderEventContent} // For Custom Rendering
            eventClick={handleEventClick}
            // eventAdd={handleEventAdd}
            // eventChange={handleEventChange} // Called on drag-n-drop/resize
            // eventRemove={handleEventRemove}
          />
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" checked={props.weekendsVisible} onChange={props.toggleWeekends}></input>
            &nbsp;Toggle Weekends
          </label>
        </div>
        <Modal isOpen={!!showEventDetail} onRequestClose={() => setShowEventDetail(null)}>
          {!!showEventDetail ? <EditEvent event={showEventDetail} closeModal={() => setShowEventDetail(null)} /> : <></>}
        </Modal>
        <Footer />
      </div>
    </>
  );
};

/**
 *
 * @param eventInfo
 * @returns
 */
function renderEventContent(eventInfo: any) {
  eventInfo.textColor = eventInfo.event.extendedProps?.meta?.status?.status !== 'COMPLETED' ? 'grey' : 'white';
  const backgroundClass = eventInfo.event.extendedProps?.meta?.status?.status !== 'COMPLETED' ? 'cfc-event cfc-event-bg-blue' : ' cfc-event cfc-event-bg-green';
  eventInfo.backgroundColor = '#edebe6';

  return (
    <div className={backgroundClass}>
      <div title={eventInfo.event.title + ' - ' + eventInfo.event.extendedProps?.meta?.job?.jobFor?.fullName}>
        <Truncate lines={1} ellipsis={<span>...</span>}>
          {eventInfo.event.title} - {eventInfo.event.extendedProps?.meta?.job?.jobFor?.fullName}
        </Truncate>
      </div>
      <div>
        {' '}
        <ClockIcon size={12} /> {eventInfo.event.extendedProps?.meta?.startTime}
      </div>
    </div>
  );
}

/**
 *
 * @returns
 */
function mapStateToProps() {
  const getEventArray = createSelector((state: any) => state.eventsById, getHashValues);

  return (state: any) => {
    return {
      isLoading: state.schedules.isLoading,
      events: getEventArray(state),
      weekendsVisible: state.weekendsVisible,
      schedules: state.schedules.schedules
    };
  };
}

export default connect(mapStateToProps, { ...EventActions, fetchJobSchedule })(WorkSchedule);
