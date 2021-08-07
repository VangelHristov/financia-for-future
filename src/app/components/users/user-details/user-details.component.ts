import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import { StoreService } from '../../../services/store/store.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  user!: IUser;
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
    private errorHandlingService: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.storeService.setSideNavOpened(true);
    this.handleRouteParamsChange();
  }

  ngOnDestroy(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  showPrivateInfo(): void {
    this.router.navigate(['/users', this.user.id, 'private-info']).catch();
  }

  private handleRouteParamsChange(): void {
    this.route.params
      .pipe(
        distinctUntilChanged((a: Params, b: Params) => a.id === b.id),
        switchMap((params: Params) =>
          this.usersService.getById(params.id).pipe(
            catchError(this.errorHandlingService.catchError),
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
