import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchVisitsApi, fetchVisitApi, addVisitApi, updateVisitApi } from 'services/visits.service';

/**
 * Saga Definitions
 */
export function* fetchVisitsSaga(): any {
  yield takeEvery(actionType.FETCH_VISITS, fetchVisits);
}

export function* fetchVisitSaga(): any {
  yield takeEvery(actionType.FETCH_VISIT, fetchVisit);
}

export function* addVisitSaga(): any {
  yield takeEvery(actionType.ADD_VISIT, addVisit);
}

export function* updateVisitSaga(): any {
  yield takeEvery(actionType.UPDATE_VISIT, updateVisit);
}

/**
 * Generator functions for Saga
 */
function* fetchVisits(action: any): any {
  try {
    const response = yield call(fetchVisitsApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_VISITS_SUCCESS,
        payload: response.data.data
      });
    }

    yield put({ type: actionType.FETCH_VISITS_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_VISITS_ERROR, payload: err });
  }
}

/**
 * Fetch Visit
 *
 * @param action
 * @returns
 */
function* fetchVisit(action: any): any {
  try {
    const { data: Visit } = yield call(fetchVisitApi, action.payload.id);
    if (Visit?.data?.success) {
      return yield put({
        type: actionType.FETCH_VISIT_SUCCESS,
        payload: Visit?.data?.data
      });
    }
    yield put({
      type: actionType.FETCH_VISIT_ERROR,
      payload: Visit.data
    });

    return toast.error(getMessage(Visit.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_VISIT_ERROR, payload: err });
  }
}

function* addVisit(action: any): any {
  try {
    const { data: newVisit } = yield call(addVisitApi, action.payload);
    if (newVisit?.data?.success) {
      yield put({
        type: actionType.ADD_VISIT_SUCCESS,
        payload: newVisit?.data?.data
      });

      return toast.success(getMessage(newVisit?.data?.message));
    }
    yield put({
      type: actionType.ADD_VISIT_ERROR,
      payload: newVisit.data
    });

    return toast.error(getMessage(newVisit.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_VISIT_ERROR, payload: err });
  }
}

function* updateVisit(action: any): any {
  try {
    const { data: updatedVisit } = yield call(updateVisitApi, action.payload.id, action.payload.data);
    if (updatedVisit?.data?.success) {
      yield put({
        type: actionType.UPDATE_VISIT_SUCCESS,
        payload: updatedVisit?.data?.data
      });

      return toast.success(getMessage(updatedVisit?.data?.message));
    }
    yield put({
      type: actionType.UPDATE_VISIT_ERROR,
      payload: updatedVisit.data
    });

    return toast.error(getMessage(updatedVisit.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.UPDATE_VISIT_ERROR, payload: err });
  }
}
