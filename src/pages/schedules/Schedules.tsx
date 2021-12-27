import { SyntheticEvent, useState } from "react";
import { SlotInfo } from "react-big-calendar";

import { IEvent } from "../../common/types/events";
import { EventCalendar } from "../../common/components/EventCalendar";
import TopNavbar from "common/components/layouts/topNavbar";
import SideNavbar from "common/components/layouts/sideNavbar";

const Schedules = () => {
  const [events, setEvents] = useState<IEvent[]>([
    {
      id: "123",
      title: "Point in Time Event",
      start: new Date(),
      end: new Date(),
      addDay: false,
    },
  ]);

  const addEvent = async (event: IEvent) => {
    setEvents([...events, event]);
  };

  // const updateEvent = async (event: IEvent) => {
  //   setEvents([...events.filter((e) => e.id !== event.id), event]);
  // };

  // const deleteEvent = async (event: IEvent) => {
  //   setEvents(events.filter((e) => e.id !== event.id));
  // };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    console.log({ slotInfo });
  };

  const onSelectEvent = (event: Object, e: SyntheticEvent) => {
    console.log({ event });
    console.log({ e });
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
            <EventCalendar
              events={events}
              addEvent={addEvent}
              onSelectSlot={onSelectSlot}
              onSelectEvent={onSelectEvent}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedules;
