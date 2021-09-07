import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import {
  catchError,
  filter,
  flatMap,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { IPagedResource } from '../../../contracts/paged-resource';
import { IUser } from '../../../contracts/user';
import { StoreService } from '../../../services/store/store.service';
import { UsersService } from '../../../services/users/users.service';
import { ConfirmDialogComponent } from '../../core/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '../user-form/user-form.component';

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

  selectedUser: IUser | null = null;

  private readonly dispose$ = new Subject<void>();
  private usersPage$ = new Subject<number>();
  private deleteUser$ = new Subject<number>();
  private confirmDelete$ = new Subject<boolean>();
  private editUser$ = new Subject();

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router,
    private storeService: StoreService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.handlePageDataChange();
    this.handleSelectedUserChange();
    this.handleDeleteButtonClick();
    this.handleEditButtonClick();
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  changePage(pageEvent: PageEvent): void {
    this.storeService.setSideNavOpened(false);
    this.storeService.clearUserProfile();
    this.router.navigate(['/users']).catch();

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

  deleteSelectedUser(): void {
    this.confirmDelete$.next();
  }

  editSelectedUser(): void {
    this.editUser$.next();
  }

  private handleDeleteButtonClick(): void {
    this.deleteUser$
      .pipe(
        filter(() => this.selectedUser?.id != null),
        switchMap(() =>
          this.usersService
            // @ts-ignore
            .deleteById(this.selectedUser?.id)
            .pipe(
              catchError(() => {
                this.storeService.clearUserProfile();
                this.storeService.setSideNavOpened(false);
                this.snackBar.open(`Could not delete the user.`);
                return EMPTY;
              })
            )
        ),
        takeUntil(this.dispose$)
      )
      .subscribe(() => {
        this.storeService.clearUserProfile();
        this.storeService.setSideNavOpened(false);
        this.usersPage$.next();
        this.snackBar.open('The user has been deleted');
      });

    this.confirmDelete$
      .pipe(
        switchMap(() =>
          this.dialog
            .open(ConfirmDialogComponent)
            .afterClosed()
            .pipe(catchError(() => EMPTY))
        ),
        takeUntil(this.dispose$)
      )
      .subscribe((deleteConfirmed) => {
        if (deleteConfirmed) {
          this.deleteUser$.next(this.selectedUser?.id);
        }
      });
  }

  private handlePageDataChange(): void {
    this.usersPage$
      .pipe(
        startWith(true),
        switchMap(() =>
          this.usersService.getUsers(this.pageSize, this.page).pipe(
            catchError(() => {
              this.storeService.clearUserProfile();
              this.storeService.setSideNavOpened(false);
              this.snackBar.open(
                'Could not fetch the users. Try refreshing the page.'
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

  private handleSelectedUserChange(): void {
    this.storeService.userProfile$
      .pipe(takeUntil(this.dispose$))
      .subscribe((user: IUser | null) => {
        this.selectedUser = user;
        this.changeDetector.markForCheck();
      });
  }

  private handleEditButtonClick(): void {
    this.editUser$
      .pipe(
        switchMap(() =>
          this.dialog
            .open(UserFormComponent)
            .afterClosed()
            .pipe(
              filter((value) => value),
              catchError(() => EMPTY)
            )
        ),
        flatMap((user: IUser) =>
          this.usersService.updateUser(user).pipe(
            catchError(() => {
              this.snackBar.open('Could not update the user information.');
              return EMPTY;
            })
          )
        ),
        takeUntil(this.dispose$)
      )
      .subscribe((user) => {
        this.storeService.clearUserProfile();
        this.storeService.setSideNavOpened(false);
        this.usersPage$.next();
        this.snackBar.open(
          `${user.firstName} ${user.lastName}'s information has been updated.`
        );
      });
  }
}
