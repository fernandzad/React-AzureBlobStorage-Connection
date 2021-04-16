export interface ProgressType {
  name: string;
  progress: number;
}

export interface StateType {
  filesProgress: ProgressType[];
  setProgressFilesAction?(dispatch: any): (payload: PayloadProgressType) => void;
}

export interface StateProgressType {
  state: ProgressType[];
  dispatch: React.Dispatch<any>;
}

export interface PayloadProgressType {
  name: string;
  progress: number;
}

export interface ActionProgressType {
  type: string;
  payload: PayloadProgressType;
}

export type FilesProgressReducerType =
  (state: ProgressType[], action: ActionProgressType) => ProgressType[];
