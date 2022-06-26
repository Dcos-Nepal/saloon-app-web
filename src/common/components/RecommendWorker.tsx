import { InfoIcon } from '@primer/octicons-react';
import { IUser } from 'common/types/user';
import { ErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import { getWorkerRecommendations } from 'services/users.service';
import { formatAddress, formatTime } from 'utils';
import { getData } from 'utils/storage';
import { Loader } from './atoms/Loader';
import SelectAsync from './form/AsyncSelect';
import SelectField from './form/Select';

interface IRecomProps {
  editMode: boolean;
  jobFor: any;
  startTime: any;
  endTime: any;
  jobType: any;
  property: any;
  selectedWorkers: any[];
  handleWorkerSelection: (workers: any[]) => void;
}

export const RecommendWorker = ({ editMode, startTime, endTime, jobType, jobFor, property, selectedWorkers, handleWorkerSelection }: IRecomProps) => {
  const [recommendedTeam, setRecommendedTeam] = useState<Array<any>>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);

  const currentUser = getData('user');
  const isWorker = currentUser?.userData?.type === 'WORKER';
  const isAdmin = currentUser?.userData?.type === 'ADMIN';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const performRecommendation = () => {
    if (isAdmin) {
      (async () => {
        try {
          setIsRecommendationsLoading(true);
          const {
            data: { data: recommendationData }
          } = await getWorkerRecommendations({
            jobType: jobType,
            address: formatAddress(property),
            startTime: startTime,
            endTime: endTime
          });

          const team = recommendationData?.data?.map((recommendation: IUser) => {
            return {
              label: recommendation.fullName,
              value: recommendation._id,
              meta: recommendation
            };
          });

          if (team.length !== 0) {
            setRecommendedTeam(team);
            handleWorkerSelection([team[0]]);
            setIsRecommended(true);
          } else {
            isRecommended && handleWorkerSelection([]);
            setRecommendedTeam([]);
            setIsRecommended(false);
          }
        } catch (ex) {
          console.log(ex);
        } finally {
          setIsRecommendationsLoading(false);
        }
      })();
    }
  }

  useEffect(() => {
    if (jobType && jobFor && property && (endTime || startTime)) {
      if (editMode && selectedWorkers.length === 0) {
        performRecommendation();
      } else {
        performRecommendation();
      }
    } else {
      isRecommended && handleWorkerSelection([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobType, jobFor, property, startTime, endTime]);

  const formatOptionLabel = ({ label, meta }: any) => (
    <div>
      <div><b>{label}</b> {!!meta && meta?.distance > 0 ? ` || Around ${(meta?.distance || 0)/1000 < 1 ? 'less than 1 ' : ((meta?.distance || 0)/1000).toFixed(2)} km away` : ''}</div>
      {!!meta ? (
        <div>
          <div style={{color: "green"}}>{formatAddress({...meta?.address, city: ''})}</div>
          <div style={{color: "#6699ff" }}>Working Hours: {formatTime(meta?.userData?.workingHours?.start)} - {formatTime(meta?.userData?.workingHours?.end)}</div>
          <div style={{color: "#3366ff"}}>Services: {meta.userData?.services.join(', ')}</div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="row">
        {isRecommendationsLoading ? (
          <Loader isLoading />
        ) : recommendedTeam.length ? (
          <>
            <SelectField
              label=""
              name="team"
              isMulti={true}
              customOption={formatOptionLabel}
              options={recommendedTeam}
              helperComponent={
                <div className="row text-danger mt-1 mb-2">
                  <ErrorMessage name="team" />
                </div>
              }
              value={selectedWorkers}
              handleChange={handleWorkerSelection}
              preload={true}
            />
            <small className="text-success">
              <InfoIcon size={14} /> Recommended workers found for the job. Select one from dropdown.
            </small>
          </>
        ) : (
          <>
            <SelectAsync
              name={`team`}
              label="Select Workers"
              value={selectedWorkers}
              resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'WORKER' } }}
              onChange={handleWorkerSelection}
              customOption={formatOptionLabel}
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
  );
};
