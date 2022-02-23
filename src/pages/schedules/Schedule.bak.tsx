import { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from "@fullcalendar/rrule";
import luxonPlugin from "@fullcalendar/luxon2";
import { getHashValues } from 'utils';
import EventActions from 'store/actions/events.actions';
import { IEvent } from 'common/types/events';
import Modal from 'common/components/atoms/Modal';
import useMountedRef from 'common/hooks/is-mounted';
import EditEvent from './EditEvent';

const WorkSchedule = (props: any) => {
  const isMounted = useMountedRef();
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();
  const [events] = useState([
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

  const handleDateSelect = (selectInfo: any) => {
    let calendarApi = selectInfo.view.calendar
    let title = prompt('Please enter a new title for your event')

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({ // will render immediately. will call handleEventAdd
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      }, true) // temporary=true, will get overwritten when reducer gives new events
    }
  }

  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      console.log("Info: ", clickInfo);
      if (isMounted) {
        setShowEventDetail(clickInfo.event);
      }
      //clickInfo.event.remove() // will render immediately. will call handleEventRemove
    }
  }

  // handlers that initiate reads/writes via the 'action' props
  // ------------------------------------------------------------------------------------------

  const handleDates = (rangeInfo: any) => {
    // props.requestEvents(rangeInfo.startStr, rangeInfo.endStr)
    //   .catch(reportNetworkError);
  }

  const handleEventAdd = (addInfo: any) => {
    // props.createEvent(addInfo.event.toPlainObject())
    //   .catch(() => {
    //     reportNetworkError()
    //     addInfo.revert()
    //   });
  }

  const handleEventChange = (changeInfo: any) => {
    // props.updateEvent(changeInfo.event.toPlainObject())
    //   .catch(() => {
    //     reportNetworkError()
    //     changeInfo.revert()
    //   });
  }

  const handleEventRemove = (removeInfo: any) => {
    // props.deleteEvent(removeInfo.event.id)
    //   .catch(() => {
    //     reportNetworkError()
    //     removeInfo.revert()
    //   });
  }

  return (
    <>
      <div className="row d-flex flex-row mb-3">
        <div className="col ">
          <h3 className="extra">Work Schedule</h3>
        </div>
        <label className="txt-grey">Total of <strong>56</strong> Jobs/Visits Scheduled for today</label>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin, luxonPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay, agendaDay'
        }}
        initialView='dayGridMonth'
        timeZone="Australia/Adelaide"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={props.weekendsVisible}
        datesSet={handleDates}
        select={handleDateSelect}
        displayEventEnd={true}
        displayEventTime={true}
        events={events}
        eventContent={renderEventContent} // For Custom Rendering
        eventClick={handleEventClick}
        eventAdd={handleEventAdd}
        eventChange={handleEventChange} // Called on drag-n-drop/resize
        eventRemove={handleEventRemove}
      />
      <div className='form-group'>
        <label>
          <input
            type='checkbox'
            checked={props.weekendsVisible}
            onChange={props.toggleWeekends}
          ></input>
          &nbsp;Toggle Weekends
        </label>
      </div>
      <Modal
        isOpen={!!showEventDetail}
        onRequestClose={() => setShowEventDetail(null)}
      >
        {(!!showEventDetail) ? (
          <EditEvent
            event={showEventDetail}
            closeModal={() => setShowEventDetail(null)} />
        ) : <></>}
      </Modal>
    </>
  )
}

function renderEventContent(eventInfo: any) {
  eventInfo.textColor = "blue";
  const backgroundClass = (eventInfo.event.title === 'Recurring Event') ? 'cfc-event cfc-event-bg-blue' : ' cfc-event cfc-event-bg-green';
  eventInfo.backgroundColor = '#edebe6';

  return (
    <div className={backgroundClass}>
      <div>{eventInfo.event.title}</div>
    </div>
  )
}

function mapStateToProps() {
  const getEventArray = createSelector(
    (state: any) => state.eventsById,
    getHashValues
  )

  return (state: any) => {
    return {
      events: getEventArray(state),
      weekendsVisible: state.weekendsVisible
    }
  }
}

export default connect(mapStateToProps, EventActions)(WorkSchedule)
