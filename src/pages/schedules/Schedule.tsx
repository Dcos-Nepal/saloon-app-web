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
import EventDetail from './EventDetail';
import { fetchJobSchedule } from 'store/actions/schedule.actions';
import { Loader } from 'common/components/atoms/Loader';
import Truncate from 'react-truncate';
import { ClockIcon } from '@primer/octicons-react';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { rrulestr } from 'rrule';
import { getCurrentUser } from 'utils';
import { toast } from 'react-toastify';

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
          start: event.inheritJob && event.job.startDate ? event.job.startDate : event.startDate,
          end: event.inheritJob && event.job.endDate ? event.job.endDate : event.endDate,
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
    const scheduleFor: { visitFor?: string; team?: string } = {};

    if (!currUser) return toast.error('No User Found!');
    if (currUser.role === 'CLIENT') scheduleFor.visitFor = currUser.id;
    if (currUser.role === 'WORKER') scheduleFor.team = currUser.id;

    props.fetchJobSchedule({ ...scheduleFor, startDate: rangeInfo.start.toISOString(), endDate: rangeInfo.end.toISOString() });
  };

  return (
    <>
      <SideNavbar active="Schedule" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row d-flex flex-row mb-3">
          <div className="col d-flex flex-row">
            <h3 className="extra">Work Schedule</h3>
          </div>
          <div className="col">
            <div className="form-group mt-3 d-flex float-end">
              <input type="checkbox" className="mt-1" checked={props.weekendsVisible} onChange={props.toggleWeekends}></input>
              <label>&nbsp;Toggle Weekends</label>
            </div>
          </div>
          <label className="txt-grey">
            <ClockIcon /> Scheduled Jobs/Visits
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
              displayEventEnd={true}
              displayEventTime={true}
              events={events}
              eventContent={renderEventContent} // For Custom Rendering
              eventClick={handleEventClick}
            />
            <Loader isLoading={props.isLoading} />
          </div>
        </div>
        <Modal isOpen={!!showEventDetail} onRequestClose={() => setShowEventDetail(null)}>
          {!!showEventDetail ? <EventDetail event={showEventDetail} closeModal={() => setShowEventDetail(null)} /> : <></>}
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
        <ClockIcon size={12} /> {new Date(eventInfo.event.start).toLocaleTimeString('en-US', { timeZone: 'Australia/Adelaide' })}
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
