import { Component, OnInit, ViewChild, HostListener } from '@angular/core'
import { User } from 'src/app/_models/user'
import { ActivatedRoute } from '@angular/router'
import { AlertifyService } from 'src/app/_services/alertify.service'
import { NgForm } from '@angular/forms'
import { AuthService } from 'src/app/_services/auth.service'
import { UserService } from 'src/app/_services/user.service'

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
    // parse template name of form
    @ViewChild('editForm') editForm: NgForm

    // when window is closed
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.editForm.dirty) $event.returnValue = true
    }

    user: User
    photoUrl: string

    constructor(
        private route: ActivatedRoute,
        private alertify: AlertifyService,
        private authService: AuthService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.user = data['user']
        })
        this.authService.currentPhotoUrl.subscribe((url) => (this.photoUrl = url))
    }

    updateUser() {
        this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
            (next) => {
                this.alertify.success('Profile updated successfully!')
                this.editForm.reset(this.user) // populate form as saved
            },
            (error) => {
                this.alertify.error('Failed to save profile!')
            }
        )
    }

    // mainPhotoUpdated(photoUrl) {
    //     this.user.photoUrl = photoUrl
    // }
}
