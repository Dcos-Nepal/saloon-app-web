import { toast } from "react-toastify";
import * as actionType from "../constants";
import { getMessage } from "common/messages";
import { call, put, takeEvery } from "redux-saga/effects";
import { fetchUsersApi, addUserApi, updateUserApi, fetchUserApi } from "services/users.service";

/**
 * Saga Definitions
 */
export function* fetchWorkersSaga(): any {
  yield takeEvery(actionType.FETCH_WORKERS, fetchWorkers);
}

/**
 * Generator functions for Saga
 */
function* fetchWorkers(action: any): any {
  try {
    const response = yield call(fetchUsersApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_WORKERS_SUCCESS,
        payload: response.data.data,
      });
    }

    yield put({ type: actionType.FETCH_WORKERS_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_WORKERS_ERROR, payload: err });
  }
}

export function* addWorkerSaga(): any {
  yield takeEvery(actionType.ADD_WORKER, addWorker);
}

function* addWorker(action: any): any {
  try {
    const { data: newWorker } = yield call(addUserApi, action.payload);
    if (newWorker?.data?.success) {
      yield put({
        type: actionType.ADD_WORKER_SUCCESS,
        payload: newWorker?.data?.data,
      });

      return toast.success(getMessage(newWorker?.data?.message));
    }
    yield put({
      type: actionType.ADD_WORKER_ERROR,
      payload: newWorker.data,
    });

    return toast.error(getMessage(newWorker.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_WORKER_ERROR, payload: err });
  }
}

export function* fetchWorkerSaga(): any {
  yield takeEvery(actionType.FETCH_WORKER, fetchWorker);
}

function* fetchWorker(action: any): any {
  try {
    const { data: newWorker } = yield call(fetchUserApi, action.payload);
    if (newWorker?.data?.success) {
      return yield put({
        type: actionType.FETCH_WORKER_SUCCESS,
        payload: newWorker?.data?.data,
      });
    }
    yield put({
      type: actionType.FETCH_WORKER_ERROR,
      payload: newWorker.data,
    });

    return toast.error(getMessage(newWorker.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_WORKER_ERROR, payload: err });
  }
}

export function* updateWorkerSaga(): any {
  yield takeEvery(actionType.UPDATE_WORKER, updateWorker);
}

function* updateWorker(action: any): any {
  try {
    const { data: newWorker } = yield call(updateUserApi, action.payload);
    if (newWorker?.data?.success) {
      yield put({
        type: actionType.UPDATE_WORKER_SUCCESS,
        payload: newWorker?.data?.data,
      });

      return toast.success(getMessage(newWorker?.data?.message));
    }
    yield put({
      type: actionType.UPDATE_WORKER_ERROR,
      payload: newWorker.data,
    });

    return toast.error(getMessage(newWorker.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.UPDATE_WORKER_ERROR, payload: err });
  }
}
