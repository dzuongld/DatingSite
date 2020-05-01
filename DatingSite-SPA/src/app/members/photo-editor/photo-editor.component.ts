import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FileUploader } from 'ng2-file-upload'

import { Photo } from 'src/app/_models/photo'
import { environment } from 'src/environments/environment'
import { AuthService } from 'src/app/_services/auth.service'
import { UserService } from 'src/app/_services/user.service'
import { AlertifyService } from 'src/app/_services/alertify.service'

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
    @Input() photos: Photo[]
    // @Output() mainChanged = new EventEmitter()

    uploader: FileUploader
    hasBaseDropZoneOver: boolean
    // response: string
    baseUrl = environment.apiUrl
    currentMainPhoto: Photo

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit(): void {
        this.initializeUploader()
    }

    initializeUploader() {
        this.uploader = new FileUploader({
            url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
            authToken: 'Bearer ' + localStorage.getItem('token'),
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: false,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024,
        })

        this.hasBaseDropZoneOver = false

        // * fix cors issue with file upload
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false
        }

        this.uploader.onSuccessItem = (item, response, status, header) => {
            if (response) {
                const res: Photo = JSON.parse(response)
                const photo = {
                    id: res.id,
                    url: res.url,
                    dateAdded: res.dateAdded,
                    description: res.description,
                    isMain: res.isMain,
                }
                this.photos.push(photo)

                // set to main if there is no photo yet
                if (photo.isMain) {
                    this.authService.changePhoto(photo.url)
                    this.authService.currentUser.photoUrl = photo.url
                    localStorage.setItem('user', JSON.stringify(this.authService.currentUser))
                }
            }
        }

        // this.response = ''

        // this.uploader.response.subscribe((res) => (this.response = res))
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e
    }

    setMainPhoto(photo: Photo) {
        this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
            () => {
                this.currentMainPhoto = this.photos.filter((p) => p.isMain)[0]
                this.currentMainPhoto.isMain = false
                photo.isMain = true

                // this.mainChanged.emit(photo.url)
                this.authService.changePhoto(photo.url)
                this.authService.currentUser.photoUrl = photo.url
                localStorage.setItem('user', JSON.stringify(this.authService.currentUser))

                this.alertify.success('Photo set to main')
            },
            (error) => {
                this.alertify.error('Could not set main photo')
            }
        )
    }

    deletePhoto(id: number) {
        this.alertify.confirm('Are you sure you want to remove this photo?', () => {
            const userId = this.authService.decodedToken.nameid
            this.userService.deletePhoto(userId, id).subscribe(
                () => {
                    const index = this.photos.findIndex((p) => p.id == id)
                    this.photos.splice(index, 1)
                    this.alertify.success('Photo deleted')
                },
                (error) => {
                    this.alertify.error('Cannot delete photo')
                }
            )
        })
    }
}
