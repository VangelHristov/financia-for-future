import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { IPagedResource } from '../../../contracts/paged-resource';
import { IUser } from '../../../contracts/user';
import { StoreService } from '../../../services/store/store.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  displayedColumns = [
    'firstName',
    'middleName',
    'lastName',
    'createdAt',
    'streetAddress',
    'balance',
  ];

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  private readonly dispose$ = new Subject<void>();
  private usersPage$ = new Subject<number>();

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router,
    private storeService: StoreService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usersPage$
      .pipe(
        startWith(true),
        switchMap(() =>
          this.usersService.getUsers(this.pageSize, this.page).pipe(
            catchError(() => {
              this.snackBar.open(
                'Something went wrong. Try reloading the page.'
              );
              return EMPTY;
            })
          )
        ),
        takeUntil(this.dispose$)
      )
      .subscribe((response: IPagedResource<IUser>) => {
        this.users = response.data;
        this.totalPages = response.page.totalPages;
        this.totalItems = response.page.totalItems;
        this.changeDetector.markForCheck();
      });
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  changePage(pageEvent: PageEvent): void {
    if (pageEvent.pageSize !== this.pageSize) {
      this.pageSize = pageEvent.pageSize;
      this.page = 1;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.usersPage$.next();
      return;
    }

    if (pageEvent.previousPageIndex !== pageEvent.pageIndex) {
      this.page = pageEvent.pageIndex + 1;
      this.usersPage$.next();
    }
  }

  getDetails(user: IUser): void {
    this.storeService.setSideNavOpened(true);
    this.storeService.setUserProfile(user);
    this.router.navigate(['/users', user.id, 'details']).catch();
  }
}
