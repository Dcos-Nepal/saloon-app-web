const StartOnDate = ({
  onDate: { date },
  handleChange
}: any) => {
  const formattedDate = date.split(' ')[0];
  const formattedTime = date.split(' ')[1];

  return (
    <>
      <div className='col-5'>
      <input type="date" className="form-control" value={formattedDate} onChange={(event: any) => {
          const editedEvent = {
            target: {
              value: `${event.target.value} ${formattedTime}`,
              name: 'start.onDate.date'
            }
          };

          handleChange(editedEvent);
        }}
      />
      </div>
      <div className='col-5'>
        <input type="time" className="form-control" value={formattedTime} onChange={(event: any) => {
            const editedEvent = {
              target: {
                value: `${formattedDate}  ${event.target.value}`,
                name: 'start.onDate.date'
              }
            };

            handleChange(editedEvent);
          }}
        />
      </div>
    </>
  );
};

export default StartOnDate;
