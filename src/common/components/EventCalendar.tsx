import { FC, SyntheticEvent } from "react";

import moment from "moment";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { IEvent } from "../types/events";

const localizer = momentLocalizer(moment);

interface IProps {
  events: IEvent[];
  addEvent: (event: IEvent) => void;
  onSelectSlot: (slotInfo: SlotInfo) => any;
  onSelectEvent: (event: Object, e: SyntheticEvent) => any;
}

export const EventCalendar: FC<IProps> = ({
  events,
  onSelectSlot,
  onSelectEvent,
}) => {
  return (
    <Calendar
      localizer={localizer}
      popup={true}
      selectable={true}
      events={events}
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      style={{ height: 500 }}
    />
  );
};
