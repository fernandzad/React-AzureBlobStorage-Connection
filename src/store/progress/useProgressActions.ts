import { PayloadProgressType } from './types/progressTypes';

export const ACTIONS = {
  SET_PROGRESS_FILES: "SET_PROGRESS_FILES",
};

export const setProgressFilesAction = (dispatch: any) => (payload: PayloadProgressType) => {
  dispatch({
    type: ACTIONS.SET_PROGRESS_FILES,
    payload
  });
};
