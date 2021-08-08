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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  flatMap,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ICreditCard } from '../../../contracts/credit-card';
import { IUser } from '../../../contracts/user';
import { CreditCardService } from '../../../services/credit-card/credit-card.service';
import { StoreService } from '../../../services/store/store.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  cards: ICreditCard[] = [];

  @Output() hideDetails = new EventEmitter<void>();

  private dispose$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private storeService: StoreService,
    private changeDetector: ChangeDetectorRef,
    private creditCardsService: CreditCardService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.storeService.setSideNavOpened(true);
    this.handleRouteParamsChange();
    this.handleSelectedUserChange();
  }

  ngOnDestroy(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  showPrivateInfo(): void {
    this.router.navigate(['/users', this.user?.id, 'private-info']).catch();
  }

  private handleSelectedUserChange(): void {
    this.storeService.userProfile$
      .pipe(
        distinctUntilChanged((a, b) => a?.id === b?.id),
        takeUntil(this.dispose$)
      )
      .subscribe((user: IUser | null) => {
        this.user = user;
        this.changeDetector.markForCheck();
      });
  }

  private handleRouteParamsChange(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.usersService.getById(params.id).pipe(
            catchError(() => {
              this.storeService.clearUserProfile();
              this.storeService.setSideNavOpened(false);
              this.snackBar.open(`Could not fetch user's details.`);
              return EMPTY;
            }),
            tap((user: IUser) => (this.user = user))
          )
        ),
        flatMap((params: Params) =>
          this.creditCardsService
            .getByUserId(params.id)
            .pipe(tap((cards: ICreditCard[]) => (this.cards = cards)))
        ),
        takeUntil(this.dispose$)
      )
      .subscribe(() => this.changeDetector.markForCheck());
  }
}
