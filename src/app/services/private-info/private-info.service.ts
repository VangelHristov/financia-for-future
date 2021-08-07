import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPrivateInformation } from '../../contracts/private-information';

@Injectable({
  providedIn: 'root',
})
export class PrivateInfoService {
  private apiUrl = `${environment.apiHost}/private-information`;

  constructor(private httpClient: HttpClient) {}

  getByUserId(userId: string): Observable<IPrivateInformation[]> {
    return this.httpClient.get<IPrivateInformation[]>(this.apiUrl, {
      params: { userId },
    });
  }
}
