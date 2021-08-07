import { IUser } from './user';

export interface ApplicationState {
  userProfile: IUser | null;
  sideNavOpened: boolean;
}
