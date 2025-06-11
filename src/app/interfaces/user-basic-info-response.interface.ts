import {UserBasicInfo} from './user-basic-info.interface';

export interface UserBasicInfoResponse {
  users: UserBasicInfo[];
  count: number;
}
