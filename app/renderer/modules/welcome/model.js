import { createAction } from 'renderer/utils/actions';
import { IpcChannels } from 'common/consts/dialogs';

export const directoryOpened = data =>
  createAction(IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT, data);
