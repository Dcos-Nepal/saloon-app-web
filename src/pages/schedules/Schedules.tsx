import { SyntheticEvent, useRef, useState } from "react";
import { SlotInfo } from "react-big-calendar";

import { IEvent } from "../../common/types/events";
import { EventCalendar } from "../../common/components/EventCalendar";
import Modal from "common/components/atoms/Modal";
import EventDetail from "./EventDetail";
import useMountedRef from "common/hooks/is-mounted";

const Schedules = () => {
  const bcRef = useRef();
  const isMounted = useMountedRef();
  const [showEventDetail, setShowEventDetail] = useState<IEvent | null>();
  const [events, setEvents] = useState<IEvent[]>([
    {
      id: "0",
      title: "This is event before point of time",
      start: new Date("2022-01-12T00:41:22.249Z"),
      end: new Date("2022-01-12T04:41:22.249Z"),
      type: "blue-event",
      allDay: false,
    },
    {
      id: "1",
      title: "Point in Time Event",
      start: new Date(),
      type: "green-event",
      end: new Date("2022-01-12T02:41:22.249Z"),
      allDay: false,
    },
    {
      id: "2",
      title: "After Point in Time Event",
      start: new Date("2022-01-13T03:41:22.249Z"),
      end: new Date("2022-01-13T08:41:22.249Z"),
      allDay: false,
    },
    {
      id: "3",
      title: "Another day",
      start: new Date("2022-01-13T21:41:22.249Z"),
      end: new Date("2022-01-14T04:31:22.249Z"),
      allDay: false,
      type: "green-event",
    },
  ]);

  const onSelectEvent = (event: any, e: SyntheticEvent) => {
    if (isMounted) {
      setShowEventDetail(event);
    }
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    if (isMounted) {
      addEvent({
        id: events.length.toString(),
        start: new Date(slotInfo.start),
        end: new Date(slotInfo.end),
        title: slotInfo.action,
        allDay: false,
      });
    }
  };

  const addEvent = async (event: IEvent) => {
    if (isMounted) {
      setEvents([...events, event]);
    }
  };

  const updateEvent = async (event: IEvent) => {
    if (isMounted) {
      setEvents([...events.filter((e) => e.id !== event.id), event]);
    }
  };

  const deleteEvent = async (event: IEvent) => {
    if (isMounted) {
      if (window.confirm("Are you sure you sant to delete this Event?")) {
        setEvents(events.filter((e) => e.id !== event.id));
      }
    }
  };

  return (
    <>
      <div className="d-flex flex-row">
        <h3>Work Schedule</h3>
      </div>
      <div className="body-container">
        <div ref={bcRef.current}>
          <EventCalendar
            events={events}
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
          />
        </div>
      </div>
      <Modal
        isOpen={!!showEventDetail}
        onRequestClose={() => setShowEventDetail(null)}
      >
        {(!!showEventDetail && (
          <EventDetail
            event={showEventDetail}
            closeModal={() => setShowEventDetail(null)}
          />
        )) || <div></div>}
      </Modal>
    </>
  );
};

export default Schedules;
