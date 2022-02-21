interface Props {
  id: string;
  onDate: any;
  handleChange: ({ target }: any) => void;
  translations: any;
}

const EndOnDate = ({ onDate: { date }, handleChange }: Props) => {
  const formattedDate = date.split(' ')[0];
  const formattedTime = date.split(' ')[1];

  return (
    <>
      <div className="col-sm-5">
        <input
          type="date"
          className="form-control"
          value={formattedDate}
          onChange={(event: any) => {
            const editedEvent = {
              target: {
                value: `${event.target.value} ${formattedTime}`,
                name: 'end.onDate.date'
              }
            };

            handleChange(editedEvent);
          }}
        />
      </div>
      <div className="col-sm-3">
        <input
          type="time"
          className="form-control"
          value={formattedTime}
          onChange={(event: any) => {
            const editedEvent = {
              target: {
                value: `${formattedDate} ${event.target.value}`,
                name: 'end.onDate.date'
              }
            };

            handleChange(editedEvent);
          }}
        />
      </div>
    </>
  );
};

export default EndOnDate;
