import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IPagedResource } from '../../contracts/paged-resource';
import { IUser } from '../../contracts/user';
import { setPage } from '../../helpers/set-page';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiHost}/users`;

  constructor(private httpClient: HttpClient) {}

  getUsers(limit = 10, page = 1): Observable<IPagedResource<IUser>> {
    return this.httpClient
      .get<Array<IUser>>(this.apiUrl, {
        params: { _limit: limit, _page: page },
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<IUser[]>) => setPage(response, limit, page))
      );
  }

  getById(id: string): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.apiUrl}/${id}`);
  }

  deleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.httpClient.put<IUser>(`${this.apiUrl}/${user.id}`, user);
  }
}
