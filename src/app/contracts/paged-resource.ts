import { IPageable } from './pageable';

export interface IPagedResource<T> {
  page: IPageable;
  data: Array<T>;
}
