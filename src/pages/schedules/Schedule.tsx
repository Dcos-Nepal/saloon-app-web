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
import EditEvent from './EditEvent';
import { fetchJobSchedule } from 'store/actions/schedule.actions';
import { Loader } from 'common/components/atoms/Loader';
import Truncate from 'react-truncate';
import { ClockIcon } from '@primer/octicons-react';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { rrulestr } from 'rrule';

const WorkSchedule = (props: any) => {
  const isMounted = useMountedRef();
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (props.schedules?.rows) {
      const mappedEvents = props.schedules.rows.map((event: any) => {
        const exRules = event.excRrule?.map((rule: string) => ({ ...rrulestr(rule).origOptions })) || [];

        return {
          title: event.inheritJob ? event.job.title : event.title,
          start: event.inheritJob ? event.job.startDate : event.startDate,
          end: event.inheritJob ? event.job.endDate : event.endDate,
          rrule: event.rruleSet,
          exrule: exRules,
          meta: event
        };
      });

      setEvents(mappedEvents);
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
    props.fetchJobSchedule({ startDate: rangeInfo.start.toISOString(), endDate: rangeInfo.end.toISOString() });
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
            <Loader isLoading={props.isLoading} />
          </div>

          <div className="form-group mt-3">
            <label>
              <input type="checkbox" checked={props.weekendsVisible} onChange={props.toggleWeekends}></input>
              &nbsp;Toggle Weekends
            </label>
          </div>
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
 * Render content/event accordingly
 *
 * @param eventInfo
 * @returns JSX
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
        <ClockIcon size={12} /> {eventInfo.event.extendedProps?.meta?.startTime}
      </div>
    </div>
  );
}

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
      schedules: state.schedules.schedules
    };
  };
}

export default connect(mapStateToProps, { ...EventActions, fetchJobSchedule })(WorkSchedule);
