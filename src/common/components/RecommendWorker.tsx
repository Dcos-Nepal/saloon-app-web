import { InfoIcon } from "@primer/octicons-react";
import { IUser } from "common/types/user";
import { ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { getWorkerRecommendations } from "services/users.service";
import { formatAddress } from "utils";
import { getData } from "utils/storage";
import { Loader } from "./atoms/Loader";
import SelectAsync from "./form/AsyncSelect";
import SelectField from "./form/Select";

interface IRecomProps {
  jobFor: any;
  startTime: any;
  endTime: any;
  jobType: any;
  property: any;
  selectedWorkers: any[];
  handleWorkerSelection: (workers: any[]) => void;
}

export const RecommendWorker = ({startTime, endTime, jobType, jobFor, property, selectedWorkers, handleWorkerSelection}: IRecomProps) => {
  const [selectedTeam, setSelectedTeam] = useState<Array<any>>([]);
  const [recommendedTeam, setRecommendedTeam] = useState<Array<any>>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);

  const currentUser = getData('user');
  const isWorker = currentUser?.userData?.type === 'WORKER';
  const isAdmin = currentUser?.userData?.type === 'ADMIN';

  useEffect(() => {
    if (jobType && jobFor && property && (endTime || startTime) && selectedWorkers.length === 0) {
      if (isAdmin) {
        (async () => {
          try {
            setIsRecommendationsLoading(true);
            const { data: { data: recommendationData } } = await getWorkerRecommendations({
              jobType: jobType,
              address: formatAddress(property),
              startTime: startTime,
              endTime: endTime,
            });
  
            const team = recommendationData?.data?.map((recommendation: IUser) => {
              return {
                label: recommendation.fullName,
                value: recommendation._id
              };
            });
  
            if (team.length !== 0) {
              setSelectedTeam(team);
              setRecommendedTeam(team);
            }
  
            setSelectedTeam(!!selectedWorkers ? selectedWorkers : []);
          } catch (ex) {
            console.log(ex);
          } finally {
            setIsRecommendationsLoading(false);
          }
        })();
      }
    } else {
      setSelectedTeam(!!selectedWorkers ? selectedWorkers : []);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobType, jobFor, property, startTime, endTime, jobType, selectedWorkers.length]);

  return (
    <>
      <div className="row">
        {isRecommendationsLoading ? (
          <Loader isLoading />
        ) : recommendedTeam.length ? (
          <SelectField
            label=""
            name="team"
            isMulti={true}
            options={recommendedTeam}
            helperComponent={
              <div className="row text-danger mt-1 mb-2">
                <ErrorMessage name="team" />
              </div>
            }
            value={selectedTeam}
            handleChange={handleWorkerSelection}
            preload={true}
          />
        ) : (
          <>
            <SelectAsync
              name={`team`}
              label="Select Workers"
              value={selectedTeam}
              resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'WORKER' } }}
              onChange={handleWorkerSelection}
              isMulti={true}
              closeOnSelect={true}
              preload={true}
              isDisabled={isWorker}
            />
            <small className="text-warning">
              <InfoIcon size={14} /> No recommended workers found for the job, please select worker manually.
            </small>
          </>
        )}
      </div>
    </>
  )
}
