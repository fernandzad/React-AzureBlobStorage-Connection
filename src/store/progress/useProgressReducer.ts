import { ACTIONS } from "./useProgressActions";
import { ProgressType, ActionProgressType, FilesProgressReducerType, StateType } from './types/progressTypes';

export function filesProgressReducer(state: StateType, action: ActionProgressType) {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_PROGRESS_FILES:
      const { filesProgress } = state;
      const elements: ProgressType[] = filesProgress.filter((file: ProgressType) => file.name === payload.name);

      elements.push({
        name: payload.name,
        progress : payload.progress
      });

      return {
        ...state,
        filesProgress: elements,
      }

    default:
      throw new Error(`Invalid action "${type}"`);
  }
}