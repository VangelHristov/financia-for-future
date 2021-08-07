import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationState } from '../../contracts/application-state';
import { IUser } from '../../contracts/user';

const initialState: ApplicationState = {
  userProfile: null,
  sideNavOpened: false,
};

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly store$ = new BehaviorSubject<ApplicationState>(initialState);
  readonly userProfile$ = this.store$.pipe(map((state) => state.userProfile));
  readonly sideNavOpened$ = this.store$.pipe(
    map((state: ApplicationState) => state.sideNavOpened)
  );

  setUserProfile(userProfile: IUser) {
    this.store$.next({
      ...this.store$.value,
      userProfile,
    });
  }

  clearUserProfile() {
    this.store$.next({
      ...this.store$.value,
      userProfile: null,
    });
  }

  setSideNavOpened(sideNavOpened: boolean) {
    this.store$.next({
      ...this.store$.value,
      sideNavOpened,
    });
  }
}
