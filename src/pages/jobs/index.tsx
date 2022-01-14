import { Route, Routes } from "react-router-dom";
import JobsList from "./JobList";

const Cients = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<JobsList />} />
      </Routes>
    </>
  );
};

export default Cients;
