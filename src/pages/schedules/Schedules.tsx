import { SyntheticEvent, useState } from "react";
import { SlotInfo } from "react-big-calendar";

import { IEvent } from "../../common/types/events";
import { EventCalendar } from "../../common/components/EventCalendar";
import TopNavbar from "common/components/layouts/topNavbar";
import SideNavbar from "common/components/layouts/sideNavbar";
import Footer from "common/components/layouts/footer";

const Schedules = () => {
  const [events, setEvents] = useState<IEvent[]>([
    {
      id: "0",
      title: "This is event before point of time",
      start: new Date("2022-01-02T00:41:22.249Z"),
      end: new Date("2022-01-02T04:41:22.249Z"),
      type: "blue-event",
      allDay: false,
    },
    {
      id: "1",
      title: "Point in Time Event",
      start: new Date(),
      type: "green-event",
      end: new Date("2022-01-02T02:41:22.249Z"),
      allDay: false,
    },
    {
      id: "2",
      title: "After Point in Time Event",
      start: new Date("2022-01-03T03:41:22.249Z"),
      end: new Date("2022-01-03T08:41:22.249Z"),
      allDay: false,
    },
    {
      id: "3",
      title: "Another day",
      start: new Date("2022-01-03T21:41:22.249Z"),
      end: new Date("2022-01-04T04:31:22.249Z"),
      allDay: false,
      type: "green-event",
    },
  ]);

  const addEvent = async (event: IEvent) => {
    setEvents([...events, event]);
  };

  // const updateEvent = async (event: IEvent) => {
  //   setEvents([...events.filter((e) => e.id !== event.id), event]);
  // };

  const deleteEvent = async (event: IEvent) => {
    setEvents(events.filter((e) => e.id !== event.id));
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    console.log({ slotInfo });
    addEvent({
      id: events.length.toString(),
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end),
      title: slotInfo.action,
      allDay: false,
    });
  };

  const onSelectEvent = (event: any, e: SyntheticEvent) => {
    console.log({ event });
    console.log({ e });
    deleteEvent(event);
  };

  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Schedule" />
          <div className="col main-container">
            <div className="">
              <div className="d-flex flex-row">
                <h1>Schedule</h1>
              </div>
            </div>
            <div className="body-container">
              <EventCalendar
                events={events}
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
              />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedules;
