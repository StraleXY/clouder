import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FilePreviewComponent } from './components/file-preview/file-preview.component';
import { SharingComponent } from './components/sharing/sharing.component';
import { DetailsComponent } from './components/details/details.component';
import { DateFormaterPipe } from './pipes/date-formater.pipe';
import { FolderPreviewComponent } from './components/folder-preview/folder-preview.component';
import { FolderAddEditComponent } from './components/folder-add-edit/folder-add-edit.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { FamilyMemberVerificationComponent } from './family-member-verification/family-member-verification.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FilePreviewComponent,
    SharingComponent,
    DetailsComponent,
    DateFormaterPipe,
    FolderPreviewComponent,
    FolderAddEditComponent,
    FamilyMemberVerificationComponent,
    NotificationCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true,
      },
      DatePipe
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
