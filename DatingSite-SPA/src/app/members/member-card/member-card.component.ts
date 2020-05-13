import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { User } from 'src/app/_models/user'
import { AuthService } from 'src/app/_services/auth.service'
import { UserService } from 'src/app/_services/user.service'
import { AlertifyService } from 'src/app/_services/alertify.service'

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
    @Input() user: User
    @Output() likeRemoved = new EventEmitter<number>()

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit(): void {}

    toggleLike(id: number) {
        this.userService.toggleLike(this.authService.decodedToken.nameid, id).subscribe(
            (data) => {
                if (data['like'] === true) this.alertify.success('You liked ' + this.user.knownAs)
                else this.alertify.warning('You unliked ' + this.user.knownAs)
            },
            (error) => {
                this.alertify.error(error)
            }
        )

        this.likeRemoved.emit(this.user.id)
    }
}
