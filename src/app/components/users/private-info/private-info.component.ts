import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { IPrivateInformation } from '../../../contracts/private-information';
import { IUser } from '../../../contracts/user';
import { PrivateInfoService } from '../../../services/private-info/private-info.service';
import { StoreService } from '../../../services/store/store.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-private-info',
  templateUrl: './private-info.component.html',
  styleUrls: ['./private-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateInfoComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  privateInformation: IPrivateInformation | null = null;

  @Output() hideDetails = new EventEmitter<void>();

  private dispose$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private privateInfoService: PrivateInfoService,
    private storeService: StoreService,
    private changeDetector: ChangeDetectorRef,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.storeService.setSideNavOpened(true);

    this.storeService.userProfile$
      .pipe(
        distinctUntilChanged((a, b) => a?.id === b?.id),
        takeUntil(this.dispose$)
      )
      .subscribe((user: IUser | null) => {
        this.user = user;
        this.changeDetector.markForCheck();
      });

    this.route.params
      .pipe(
        distinctUntilChanged((a: Params, b: Params) => a.id === b.id),
        switchMap((params: Params) =>
          this.privateInfoService
            .getByUserId(params.id)
            .pipe(
              tap(
                (info: IPrivateInformation[]) =>
                  (this.privateInformation = info[0])
              )
            )
        ),
        takeUntil(this.dispose$)
      )
      .subscribe(() => this.changeDetector.markForCheck());

    // This api call is needed in case a user visits the private info url directly without clicking on the table
    this.usersService
      .getById(this.route.snapshot.params.id)
      .pipe(
        take(1),
        catchError(() => {
          this.storeService.clearUserProfile();
          this.storeService.setSideNavOpened(false);
          this.snackBar.open(
            `Could not find user with id: ${this.route.snapshot.params.id}`
          );
          return EMPTY;
        })
      )
      .subscribe((user: IUser) => {
        this.storeService.setUserProfile(user);
      });
  }

  ngOnDestroy(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  hideSideNav(): void {
    this.storeService.setSideNavOpened(false);
  }
}
