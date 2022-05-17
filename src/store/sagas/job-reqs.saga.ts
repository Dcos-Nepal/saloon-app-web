import { toast } from "react-toastify";
import * as actionType from "../constants";
import { getMessage } from "common/messages";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  addJobRequestApi,
  fetchJobRequestApi,
  fetchJobRequestsApi,
  updateJobRequestApi,
} from "services/job-requests.service";

/**
 * Saga Definitions
 */
export function* fetchJobRequestsSaga(): any {
  yield takeEvery(actionType.FETCH_JOB_REQUESTS, fetchJobRequests);
}

/**
 * Generator functions for Saga
 */
function* fetchJobRequests(action: any): any {
  try {
    const response = yield call(fetchJobRequestsApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_JOB_REQUESTS_SUCCESS,
        payload: response.data.data,
      });
    }

    yield put({
      type: actionType.FETCH_JOB_REQUESTS_ERROR,
      payload: response.data,
    });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_JOB_REQUESTS_ERROR, payload: err });
  }
}

export function* addJobRequestSaga(): any {
  yield takeEvery(actionType.ADD_JOB_REQUEST, addJobRequest);
}

/**
 * Adds Job Request
 *
 * @param action
 * @returns
 */
function* addJobRequest(action: any): any {
  try {
    const { data: newJobRequest } = yield call(
      addJobRequestApi,
      action.payload
    );
    if (newJobRequest?.data?.success) {
      yield put({
        type: actionType.ADD_JOB_REQUEST_SUCCESS,
        payload: newJobRequest?.data?.data,
      });

      return toast.success(getMessage(newJobRequest?.data?.message));
    }
    yield put({
      type: actionType.ADD_JOB_REQUEST_ERROR,
      payload: newJobRequest.data,
    });

    return toast.error(getMessage(newJobRequest.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_JOB_REQUEST_ERROR, payload: err });
  }
}

export function* fetchJobRequestSaga(): any {
  yield takeEvery(actionType.FETCH_JOB_REQUEST, fetchJobRequest);
}

function* fetchJobRequest(action: any): any {
  try {
    const { data: newRequest } = yield call(fetchJobRequestApi, action.payload);
    if (newRequest?.data?.success) {
      return yield put({
        type: actionType.FETCH_JOB_REQUEST_SUCCESS,
        payload: newRequest?.data?.data,
      });
    }
    yield put({
      type: actionType.FETCH_JOB_REQUEST_ERROR,
      payload: newRequest.data,
    });

    return toast.error(getMessage(newRequest.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_JOB_REQUEST_ERROR, payload: err });
  }
}

export function* updateJobRequestSaga(): any {
  yield takeEvery(actionType.UPDATE_JOB_REQUEST, updateJobRequest);
}

function* updateJobRequest(action: any): any {
  try {
    const { data: newRequest } = yield call(
      updateJobRequestApi,
      action.payload
    );
    if (newRequest?.data?.success) {
      yield put({
        type: actionType.UPDATE_JOB_REQUEST_SUCCESS,
        payload: newRequest?.data?.data,
      });

      return toast.success(getMessage(newRequest?.data?.message));
    }
    yield put({
      type: actionType.UPDATE_JOB_REQUEST_ERROR,
      payload: newRequest.data,
    });

    return toast.error(getMessage(newRequest.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.UPDATE_JOB_REQUEST_ERROR, payload: err });
  }
}
