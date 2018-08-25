import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject, asapScheduler, from, fromEvent, interval, merge, of, pipe } from 'rxjs';

import { AddEditPlayerComponent } from './protected/main/add-edit-player/add-edit-player.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { AppConfigService } from './shared/services/app-config.service';
import { AppDataService } from './services/app-data.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './shared/guard/auth-guard.service';
import { BlockUIInstanceService } from 'ng-block-ui/lib/services/block-ui-instance.service';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalHttpInterceptor } from './shared/guard/global-http-interceptor';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './unprotected/login/login.component';
import { MainComponent } from './protected/main/main.component';
import { MainDataService } from './protected/main/services/main-data.service';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerDetailComponent } from './protected/main/player-detail/player-detail.component';
import { PlayerListComponent } from './protected/main/player-list/player-list.component';
import { PlayerPhotoComponent } from './protected/main/player-photo/player-photo.component';
import { SharedModule } from './shared/shared.module';
import { UtilitiesService } from './shared/services/utilities.service';
import { environment } from '../environments/environment.prod';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    PlayerListComponent,
    PlayerPhotoComponent,
    PlayerDetailComponent,
    AddEditPlayerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    BlockUIModule,
    SharedModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    HttpClientModule,
    AuthGuardService,
    UtilitiesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true
    },
    BlockUIInstanceService,
    AppDataService,
    AppConfigService,
    MainDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
