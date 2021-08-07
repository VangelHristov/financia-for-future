import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(
    private snackBar: MatSnackBar,
    private storeService: StoreService
  ) {}

  catchError(_: any): Observable<never> {
    console.log(_);
    this.storeService.clearUserProfile();
    this.storeService.setSideNavOpened(false);
    this.snackBar.open('Unexpected error. Try refreshing the page.');
    return EMPTY;
  }
}
