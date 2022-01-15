import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery} from 'redux-saga/effects';
import {
    forgotUserPasswordApi, registerUserApi,
    resetUserPasswordApi, signInUserApi, vedifyEmailApi
} from 'services/auth.service';

/**
 * Saga Definations
 */
export function* userRegisterSaga() {
    yield takeEvery(actionType.AUTH_SIGNUP, registerUser);
}

export function* userSignInSaga() {
    yield takeEvery(actionType.AUTH_SIGNIN, signInUser);
}

export function* verifyUserEmailSaga() {
    yield takeEvery(actionType.AUTH_EMAIL_VERIFY, verifyUserEmail);
}

export function* forgotPasswordSaga() {
    yield takeEvery(actionType.AUTH_FORGOT_PWD, forgotPassword);
}

export function* resetPasswordSaga() {
    yield takeEvery(actionType.AUTH_RESET_PWD, resetPassword);
}

/**
 * Generator functions for Saga
 */
function* registerUser(action: any): any {
    try {
        const response = yield call(registerUserApi, action.payload);

        if (response.data.success) {
            yield put({ type: actionType.AUTH_SIGNUP_SUCCESS, payload: response});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.AUTH_SIGNUP_ERROR, payload: response });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.AUTH_SIGNUP_ERROR, payload: err });
    }
}

function* signInUser(action: any): any {
    try {
        const response = yield call(signInUserApi, action.payload);

        if (response.data.success) {
            yield put({ type: actionType.AUTH_SIGNIN_SUCCESS, payload: response});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.AUTH_SIGNIN_ERROR, payload: response });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.AUTH_SIGNIN_ERROR, payload: err });
    }
}

function* verifyUserEmail(action: any): any {
    try {
        const response = yield call(vedifyEmailApi, action.payload);

        if (response.data.success) {
            yield put({ type: actionType.AUTH_EMAIL_VERIFY_SUCCESS, payload: response});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.AUTH_EMAIL_VERIFY_ERROR, payload: response });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.AUTH_EMAIL_VERIFY_ERROR, payload: err });
    }
}

function* forgotPassword(action: any): any {
    try {
        const postResponse = yield call(forgotUserPasswordApi, action.payload);
        yield put({ type: actionType.AUTH_FORGOT_PWD_SUCCESS, payload: postResponse });
        toast.success("Password reset email has been sent to your email.")
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.AUTH_FORGOT_PWD_ERROR, payload: err });
    }
}

function* resetPassword(action: any): any {
    try {
        const postResponse = yield call(resetUserPasswordApi, action.payload);
        yield put({ type: actionType.AUTH_RESET_PWD_SUCCESS, payload: postResponse });
        toast.success("You've successfully reset your password.")
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.AUTH_RESET_PWD_ERROR, payload: err });
    }
}
