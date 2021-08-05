import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiHost}/users`;

  constructor(private httpClient: HttpClient) {}

  getUsers(limit = 10, page = 1): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>(this.apiUrl, {
      params: { _limit: limit, _page: page },
    });
  }
}
