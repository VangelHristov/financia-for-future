import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersModule } from './components/users/users.module';

@NgModule({
  declarations: [AppComponent],
  imports: [UsersModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
