import { BrowserModule } from '@angular/platform-browser'
import { NgModule, OnInit } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { JwtModule } from '@auth0/angular-jwt'
import { NgxGalleryModule } from 'ngx-gallery-9'
import { FileUploadModule } from 'ng2-file-upload'
import { TimeagoModule } from 'ngx-timeago'

import { AppComponent } from './app.component'
import { NavComponent } from './nav/nav.component'
import { AuthService } from './_services/auth.service'
import { HomeComponent } from './home/home.component'
import { RegisterComponent } from './register/register.component'
import { ErrorInterCeptorProvider } from './_services/error.interceptor'
import { MemberListComponent } from './members/member-list/member-list.component'
import { ListsComponent } from './lists/lists.component'
import { MessagesComponent } from './messages/messages.component'
import { appRoutes } from './routes'
import { MemberCardComponent } from './members/member-card/member-card.component'
import { MemberDetailComponent } from './members/member-detail/member-detail.component'
import { MemberEditComponent } from './members/member-edit/member-edit.component'
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component'
import { MemberMessagesComponent } from './members/member-messages/member-messages.component'

export function tokenGetter() {
    return localStorage.getItem('token')
}

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MemberListComponent,
        ListsComponent,
        MessagesComponent,
        MemberCardComponent,
        MemberDetailComponent,
        MemberEditComponent,
        PhotoEditorComponent,
        MemberMessagesComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxGalleryModule,
        FileUploadModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        ButtonsModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ['localhost:5000'],
                blacklistedRoutes: ['localhost:5000/api/auth'],
            },
        }),
        TabsModule.forRoot(),
        TimeagoModule.forRoot(),
    ],
    providers: [AuthService, ErrorInterCeptorProvider],
    bootstrap: [AppComponent],
})
export class AppModule {}
