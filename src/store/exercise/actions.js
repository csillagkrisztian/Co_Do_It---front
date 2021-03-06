import { apiUrl } from "../../config/constants";
import axios from "axios";
import { appLoading, appDoneLoading, setMessage } from "../appState/actions";

export const LOAD_EXERCISE = "LOAD_EXERCISE";
export const SEND_STATUS = "SEND_STATUS";
export const DELETE_STATUSES = "DELETE_STATUSES";
export const COMPLETED_EXERCISE = "COMPLETED_EXERCISE";
export const RESET_STATE = "RESET_STATE";
export const SET_EXERCISE = "SET_EXERCISE";

export const getRandomExercise = () => async (dispatch, getState) => {
  try {
    dispatch(appLoading());
    const response = await axios.get(`${apiUrl}/exercises/random`);
    const data = response.data;

    dispatch(loadExercise(data));
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
      dispatch(setMessage("danger", true, error.response.data.message));
    } else {
      dispatch(setMessage("danger", true, error.message));
    }
  }
  dispatch(appDoneLoading());
};

export const loadExercise = (data) => {
  return { type: LOAD_EXERCISE, payload: data };
};

export const sendMistakeStatus = (submits, results) => {
  return {
    type: SEND_STATUS,
    payload: `FAILED... we expected to get: [${results}], but instead we got [${submits}]`,
  };
};

export const sendErrorStatus = (error) => {
  return {
    type: SEND_STATUS,
    payload: `${error.message}`,
  };
};

export const sendSuccessStatus = (id) => {
  return {
    type: SEND_STATUS,
    payload: `PASSED... Test ${id} was successful!!!`,
  };
};

export const deleteStatuses = () => {
  return {
    type: DELETE_STATUSES,
  };
};

export const exerciseCompleted = () => {
  return {
    type: COMPLETED_EXERCISE,
  };
};

export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};

export const setNewExercise = (exercise) => {
  return {
    type: SET_EXERCISE,
    payload: exercise,
  };
};
