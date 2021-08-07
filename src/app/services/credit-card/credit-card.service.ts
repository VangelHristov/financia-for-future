import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICreditCard } from '../../contracts/credit-card';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private apiUrl = `${environment.apiHost}/credit-cards`;

  constructor(private httpClient: HttpClient) {}

  getByUserId(userId: string): Observable<ICreditCard[]> {
    return this.httpClient.get<ICreditCard[]>(this.apiUrl, {
      params: { userId },
    });
  }
}
