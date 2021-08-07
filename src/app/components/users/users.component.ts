import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
  sideNavOpened = false;

  private dispose$ = new Subject<void>();

  constructor(
    private storeService: StoreService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.storeService.sideNavOpened$
      .pipe(takeUntil(this.dispose$))
      .subscribe((value) => {
        this.sideNavOpened = value;
        this.changeDetector.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  hideSideNav(): void {
    this.storeService.setSideNavOpened(false);
    this.storeService.clearUserProfile();
  }
}
