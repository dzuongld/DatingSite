import { Component, OnInit } from '@angular/core'
import { AuthService } from '../_services/auth.service'
import { AlertifyService } from '../_services/alertify.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    model: any = {}

    constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) {}

    ngOnInit(): void {}

    login() {
        // login return observable => must subscribe
        this.authService.login(this.model).subscribe(
            (next) => {
                // success
                this.alertify.success('Logged in')
            },
            (error) => {
                this.alertify.error(error)
            },
            () => {
                // complete
                this.router.navigate(['/members'])
            }
        )
    }

    loggedIn() {
        return this.authService.loggedIn()
    }

    logout() {
        localStorage.removeItem('token')
        this.alertify.message('Logged out')
        this.router.navigate(['/home'])
    }

    getName() {
        return this.authService.decodedToken?.unique_name
    }
}
