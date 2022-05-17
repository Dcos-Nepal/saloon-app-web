import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchJobsApi, fetchJobApi, addJobApi, updateJobApi } from 'services/jobs.service';

/**
 * Saga Definitions
 */
export function* fetchJobsSaga(): any {
  yield takeEvery(actionType.FETCH_JOBS, fetchJobs);
}

export function* fetchJobSaga(): any {
  console.log('Fetch');
  yield takeEvery(actionType.FETCH_JOB, fetchJob);
}

export function* addJobSaga(): any {
  yield takeEvery(actionType.ADD_JOB, addJob);
}

export function* updateJobSaga(): any {
  yield takeEvery(actionType.UPDATE_JOB, updateJob);
}

/**
 * Generator functions for Saga
 */
function* fetchJobs(action: any): any {
  try {
    const response = yield call(fetchJobsApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_JOBS_SUCCESS,
        payload: response.data.data
      });
    }

    yield put({ type: actionType.FETCH_JOBS_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_JOBS_ERROR, payload: err });
  }
}

/**
 * Fetch Job
 *
 * @param action
 * @returns
 */
function* fetchJob(action: any): any {
  try {
    const { data: job } = yield call(fetchJobApi, action.payload.id);
    if (job?.data?.success) {
      return yield put({
        type: actionType.FETCH_JOB_SUCCESS,
        payload: job?.data?.data
      });
    }
    yield put({
      type: actionType.FETCH_JOB_ERROR,
      payload: job.data
    });

    return toast.error(getMessage(job.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_JOB_ERROR, payload: err });
  }
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

function* updateJob(action: any): any {
  try {
    const { data: updatedJob } = yield call(updateJobApi, action.payload.id, action.payload.data);
    if (updatedJob?.data?.success) {
      yield put({
        type: actionType.UPDATE_JOB_SUCCESS,
        payload: updatedJob?.data?.data
      });

      return toast.success(getMessage(updatedJob?.data?.message));
    }
    yield put({
      type: actionType.UPDATE_JOB_ERROR,
      payload: updatedJob.data
    });

    return toast.error(getMessage(updatedJob.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.UPDATE_JOB_ERROR, payload: err });
  }
}
