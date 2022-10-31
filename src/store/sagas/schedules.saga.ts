import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchSchedulesApi } from 'services/schedules.service';

/**
 * Saga Definitions
 */

export function* fetchSchedulesSaga(): any {
  yield takeEvery(actionType.FETCH_JOB_SCHEDULE, fetchSchedules);
}

/**
 * Generator functions for Saga
 */
function* fetchSchedules(action: any): any {
  try {
    const response = yield call(fetchSchedulesApi, action.payload);

    if (response?.data?.data?.success) {
      return yield put({ type: actionType.FETCH_JOB_SCHEDULE_SUCCESS, payload: response?.data?.data?.data });
    }

    yield put({ type: actionType.FETCH_JOB_SCHEDULE_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_JOB_SCHEDULE_ERROR, payload: err });
  }
}
