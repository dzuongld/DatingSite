import { Component, OnInit } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthService } from './_services/auth.service'
import { User } from './_models/user'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    jwtHelper = new JwtHelperService()

    constructor(private authService: AuthService) {}
    ngOnInit(): void {
        // retrieve token (if any) when app is loaded
        const token = localStorage.getItem('token')
        if (token) {
            this.authService.decodedToken = this.jwtHelper.decodeToken(token)
        }

        const user: User = JSON.parse(localStorage.getItem('user'))
        if (user) {
            this.authService.currentUser = user
            this.authService.changePhoto(user.photoUrl)
        }
    }
}
