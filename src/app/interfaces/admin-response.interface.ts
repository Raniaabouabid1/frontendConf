import {Admin} from './admin.interface';

export interface AdminResponse {
  admins: Admin[];
  count: number;
}
