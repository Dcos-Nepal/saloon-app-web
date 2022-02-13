import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchJobsApi, addJobApi } from 'services/jobs.service';

/**
 * Saga Definitions
 */
export function* fetchJobsSaga(): any {
  yield takeEvery(actionType.FETCH_JOBS, fetchJobs);
}

/**
 * Generator functions for Saga
 */
function* fetchJobs(action: any): any {
  try {
    const response = yield call(fetchJobsApi, action.payload);
    if (response.data?.data.success) {
      yield put({
        type: actionType.FETCH_JOBS_SUCCESS,
        payload: response.data.data
      });
      return toast.success(getMessage(response.data.message));
    }

    yield put({ type: actionType.FETCH_JOBS_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_JOBS_ERROR, payload: err });
  }
}

export function* addJobSaga(): any {
  yield takeEvery(actionType.ADD_JOB, addJob);
}

function* addJob(action: any): any {
  try {
    const { data: newJob } = yield call(addJobApi, action.payload);
    if (newJob?.data?.success) {
      yield put({
        type: actionType.ADD_JOB_SUCCESS,
        payload: newJob?.data?.data
      });

      return toast.success(getMessage(newJob?.data?.message));
    }
    yield put({
      type: actionType.ADD_JOB_ERROR,
      payload: newJob.data
    });

    return toast.error(getMessage(newJob.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_JOB_ERROR, payload: err });
  }
}
