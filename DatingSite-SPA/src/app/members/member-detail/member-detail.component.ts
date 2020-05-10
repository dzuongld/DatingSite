import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9'

import { User } from 'src/app/_models/user'
import { TabsetComponent } from 'ngx-bootstrap/tabs/ngx-bootstrap-tabs'
import { UserService } from 'src/app/_services/user.service'
import { AlertifyService } from 'src/app/_services/alertify.service'

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
    @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent

    user: User
    galleryOptions: NgxGalleryOptions[]
    galleryImages: NgxGalleryImage[]

    constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        // this.loadUser()

        // get data from route
        this.route.data.subscribe((data) => {
            this.user = data['user']
        })

        // clicking on a message will go straigt to message tab
        this.route.queryParams.subscribe((params) => {
            const selectedTab = params['tab']
            this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true
        })

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false,
            },
        ]

        this.galleryImages = this.getImages()
    }

    getImages() {
        const imageUrls = []
        for (const photo of this.user.photos) {
            imageUrls.push({
                small: photo.url,
                medium: photo.url,
                big: photo.url,
                description: photo.description,
            })
        }
        return imageUrls
    }

    selectTab(tabId: number) {
        this.memberTabs.tabs[tabId].active = true
    }

    // members/:id
    // loadUser() {
    //     this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
    //         (user: User) => {
    //             this.user = user
    //         },
    //         (error) => {
    //             this.alertify.error(error)
    //         }
    //     )
    // }
}
