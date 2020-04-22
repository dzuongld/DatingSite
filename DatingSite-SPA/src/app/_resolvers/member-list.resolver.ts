import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { User } from '../_models/user'
import { UserService } from '../_services/user.service'
import { AlertifyService } from '../_services/alertify.service'

@Injectable({ providedIn: 'root' })
export class MemberListResolver implements Resolve<User[]> {
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers().pipe(
            catchError((error) => {
                this.alertify.error('Problems getting data')
                this.router.navigate(['/home']) // go back
                return of(null)
            })
        )
    }
}
