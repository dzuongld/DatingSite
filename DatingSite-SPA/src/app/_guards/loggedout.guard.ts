import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from '../_services/auth.service'
import { AlertifyService } from '../_services/alertify.service'

@Injectable({
    providedIn: 'root',
})
export class LoggedOutGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {}

    canActivate(): boolean {
        // ok to proceed
        if (this.authService.loggedIn()) {
            this.router.navigate(['/members'])
            return false
        }
        return true
    }
}
