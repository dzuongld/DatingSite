import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { User } from '../_models/user'
import { Pagination, PaginatedResult } from '../_models/pagination'
import { AuthService } from '../_services/auth.service'
import { UserService } from '../_services/user.service'
import { AlertifyService } from '../_services/alertify.service'

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
    users: User[]
    pagination: Pagination
    likesParam: string

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private alertify: AlertifyService
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.users = data['users'].result
            this.pagination = data['users'].pagination
        })
        this.likesParam = 'Likers'
    }

    loadUsers() {
        this.userService
            .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
            .subscribe(
                (res: PaginatedResult<User[]>) => {
                    this.users = res.result
                    this.pagination = res.pagination
                },
                (error) => {
                    this.alertify.error(error)
                }
            )
    }

    pageChanged(event: any) {
        this.pagination.currentPage = event.page
        this.loadUsers()
    }

    refreshList(id: number) {
        const index = this.users.findIndex((user) => user.id === id)
        this.users.splice(index, 1)
    }
}
