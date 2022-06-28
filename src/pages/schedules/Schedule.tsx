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
import Truncate from 'react-truncate';
import { ClockIcon } from '@primer/octicons-react';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import RRule, { Frequency, rrulestr } from 'rrule';
import { getCurrentUser } from 'utils';
import { toast } from 'react-toastify';
import { IVisit } from 'pages/jobs/detail/ClientJobDetailData';
import { addVisitApi, completeVisitApi, updateStatus, updateVisitApi } from 'services/visits.service';
import { getData } from 'utils/storage';
import CompleteVisit from './CompleteVisit';
import VisitCompletedActions from 'pages/jobs/detail/VisitCompletedActions';
import ScheduleEventDetail from './EventDetail';
import { DateTime } from 'luxon';

const WorkSchedule = (props: any) => {
  const isMounted = useMountedRef();
  const [events, setEvents] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();
  const [showVisitCompleteForm, setShowVisitCompleteForm] = useState(false);
  const [askVisitInvoiceGeneration, setAskVisitInvoiceGeneration] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState({ start: new Date(), end: new Date() });

  /**
   * Creates Rrule for one-time-off job visit
   *
   * @param visit any
   * @returns String
   */
  const createOneOffRule = (visit: any) => {
    return new RRule({
      dtstart: new Date(`${visit.startDate} ${visit.startTime}`),
      interval: 1,
      count: 1,
      freq: Frequency.DAILY
    }).toString();
  };

  /**
   * Handles the process of marking the visit as complete
   *
   * @param visitCompleted Boolean
   * @param visit IVisitList
   * @returns Void
   */
  const markVisitCompleteHandler = async (visitCompleted: boolean, visit: IVisit) => {
    let newlyCreatedVisit: any;

    // If the visit has multiple visits
    if (visit.hasMultiVisit) {
      // Create One-Off rrule for to-complete visit
      const rrule = createOneOffRule({ ...visit, startDate: DateTime.fromJSDate(visit?.startDate).toFormat('yyyy-MM-dd') });

      let newVisit = { ...visit };
      delete newVisit._id;

      // Creating the visit with completed status
      newlyCreatedVisit = await addVisitApi({
        ...newVisit,
        job: newVisit.job._id,
        inheritJob: false,
        rruleSet: rrule,
        visitFor: newVisit.job?.jobFor?._id,
        team: newVisit.team.map((t: { _id: string }) => t._id),
        status: {
          status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED',
          updatedBy: getData('user')._id
        },
        isPrimary: false,
        hasMultiVisit: false
      });

      // Update existing primary visit with newly created visit as exception
      await updateVisitApi(visit._id, {
        excRrule: [...visit.excRrule, rrule]
      });
    } else {
      await updateStatus(visit._id, { status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED' });
    }

    // Now if the visit complete step is complete, ask to fill the visit completion form.
    setSelectedVisit({
      ...(visit.hasMultiVisit ? newlyCreatedVisit?.data.data.data : visit),
      job: visit.job
    });

    // Hide the event detail view and show Complete visit Form
    setShowEventDetail(null);
    setShowVisitCompleteForm(true);
  };

  /**
   * Visit complete handler
   * @param data
   */
  const completeVisitHandler = async (data: any) => {
    try {
      await completeVisitApi(selectedVisit?._id, data);

      const currUser = getCurrentUser();
      const scheduleFor: { visitFor?: string; team?: string } = {};

      if (!currUser) return toast.error('No User Found!');
      if (currUser.role === 'CLIENT') scheduleFor.visitFor = currUser.id;
      if (currUser.role === 'WORKER') scheduleFor.team = currUser.id;

      setCurrentDateRange(currentDateRange);
      props.fetchJobSchedule({ ...scheduleFor, startDate: currentDateRange.start.toISOString(), endDate: currentDateRange.end.toISOString() });

      setAskVisitInvoiceGeneration(true);
      setShowVisitCompleteForm(false);
    } catch (ex) {
      toast.error('Failed to complete visit');
    }
  };

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

    setCurrentDateRange(rangeInfo);

    props.fetchJobSchedule({ ...scheduleFor, startDate: rangeInfo.start.toISOString(), endDate: rangeInfo.end.toISOString(), limit: (currUser.role === 'ADMIN' ? 1000 : 300) });
  };

  /**
   * Render content/event accordingly
   *
   * @param eventInfo
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
        <div title={eventInfo.event.title + ' - ' + meta?.job?.jobFor?.fullName}>
          <Truncate lines={1} ellipsis={<span>...</span>}>
            {eventInfo.event.title} - {meta?.job?.jobFor?.fullName}
          </Truncate>
        </div>
        <div>
          <ClockIcon size={12} /> {new Date(eventInfo.event.start).toLocaleTimeString('en-AU')}
          {/* <ClockIcon size={12} /> {new Date(eventInfo.event.start).toLocaleTimeString('en-US', { timeZone: 'Australia/Adelaide' })} */}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (props.schedules?.rows) {
      const mappedEvents = props.schedules.rows.map((event: any) => {
        if (event.job?.type === 'ONE-OFF') {
          return {
            title: event.inheritJob ? event.job?.title : event?.title,
            start: DateTime.fromISO(event.inheritJob && event.job?.startDate ? event.job?.startDate : event?.startDate).toFormat('yyyy-MM-dd hh:mm'),
            end: DateTime.fromISO(event.inheritJob && event.job?.endDate ? event.job?.endDate : event?.endDate).toFormat('yyyy-MM-dd hh:mm'),
            meta: {...event, lineItems: event.inheritJob ? event.job?.lineItems : event.lineItems}
          };
        }

        const exRules = event.excRrule?.map((rule: string) => ({ ...rrulestr(rule).origOptions })) || [];
        
        return {
          title: event.inheritJob ? event.job?.title : event?.title,
          rrule: event.rruleSet,
          exrule: exRules,
          meta: {...event, lineItems: event.inheritJob ? event.job?.lineItems : event.lineItems},
          startTime: event.startTime ? event.startTime : '',
          endTime: event.endTime ? event.endTime : '',
        };
      });

      setEvents(mappedEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  return (
    <>
      <SideNavbar active="Schedule" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row d-flex flex-row mb-3">
          <div className="col-8 d-flex flex-row">
            <h3 className="extra">Work Schedule</h3>
          </div>
          <div className="col-2">
            <div className="form-group mt-3 d-flex float-end">
              <input type="checkbox" className="mt-1" id="toggle-completed" checked={props.completedVisible} onChange={props.toggleCompleted}></input>
              <label htmlFor="toggle-completed">&nbsp;Toggle Completed</label>
            </div>
          </div>
          <div className="col-2">
            <div className="form-group mt-3 d-flex float-end">
              <input type="checkbox" className="mt-1" id="toggle-weekends" checked={props.weekendsVisible} onChange={props.toggleWeekends}></input>
              <label htmlFor="toggle-weekends">&nbsp;Toggle Weekends</label>
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
              // timeZone="Australia/Adelaide"
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

        {/* Modals Section */}
        <Modal isOpen={!!showEventDetail} onRequestClose={() => setShowEventDetail(null)}>
          {!!showEventDetail ? (
            <ScheduleEventDetail markVisitCompleteHandler={markVisitCompleteHandler} event={showEventDetail} closeModal={() => setShowEventDetail(null)} />
          ) : (
            <></>
          )}
        </Modal>

        <Modal isOpen={showVisitCompleteForm} onRequestClose={() => setShowVisitCompleteForm(false)}>
          <CompleteVisit
            completeVisit={completeVisitHandler}
            closeModal={() => {
              setShowVisitCompleteForm(false);
            }}
            visit={selectedVisit}
          />
        </Modal>

        <Modal isOpen={askVisitInvoiceGeneration && !!selectedVisit} onRequestClose={() => setAskVisitInvoiceGeneration(false)}>
          <VisitCompletedActions visit={selectedVisit} onClose={() => setAskVisitInvoiceGeneration(false)} cleanup={() => setSelectedVisit(null)} />
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
