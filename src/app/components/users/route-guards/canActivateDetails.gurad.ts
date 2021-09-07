import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store/store.service';

@Injectable({ providedIn: 'root' })
export class CanActivateDetails implements CanActivate {
  constructor(private storeService: StoreService, private router: Router) {}
  canActivate(): boolean {
    if (this.storeService.hasUserProfile()) {
      return true;
    }

    this.router.navigate(['/users']).catch();

    return this.storeService.hasUserProfile();
  }
}
