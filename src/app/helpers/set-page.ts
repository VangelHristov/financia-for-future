import { HttpResponse } from '@angular/common/http';
import { IPagedResource } from '../contracts/paged-resource';

export const setPage = (
  res: HttpResponse<any>,
  limit: number,
  page: number
): IPagedResource<any> => {
  const totalItems = parseInt(res.headers.get('X-Total-Count') ?? '1');

  return {
    page: {
      number: page,
      size: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    data: res.body,
  };
};
