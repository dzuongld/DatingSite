import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { User } from '../_models/user'
import { PaginatedResult } from '../_models/pagination'
import { map } from 'rxjs/operators'
import { Message } from '../_models/message'

// * no longer needed as handles by JwtModule
// const httpOptions = {
//     headers: new HttpHeaders({
//         Authorization: 'Bearer ' + localStorage.getItem('token'),
//     }),
// }

@Injectable({
    providedIn: 'root',
})
export class UserService {
    baseUrl = environment.apiUrl

    constructor(private http: HttpClient) {}

    getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginatedResult<User[]>> {
        // return this.http.get<User[]>(this.baseUrl + 'users', httpOptions)

        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>()

        let params = new HttpParams()
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page)
            params = params.append('pageSize', itemsPerPage)
        }

        if (userParams != null) {
            params = params.append('minAge', userParams.minAge)
            params = params.append('maxAge', userParams.maxAge)
            params = params.append('gender', userParams.gender)
            params = params.append('orderBy', userParams.orderBy)
        }

        if (likeParams === 'Likers') {
            params = params.append('likers', 'true')
        } else if (likeParams === 'Likees') {
            params = params.append('likees', 'true')
        }

        return this.http
            .get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
            .pipe(
                // process response
                map((response) => {
                    paginatedResult.result = response.body // containing the user
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
                    }
                    return paginatedResult
                })
            )
    }

    getUser(id: number): Observable<User> {
        // return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions)
        return this.http.get<User>(this.baseUrl + 'users/' + id)
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + 'users/' + id, user)
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {})
    }

    deletePhoto(userId: number, id: number) {
        return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
    }

    toggleLike(id: number, recipientId: number) {
        return this.http.post(this.baseUrl + 'users/' + id + '/togglelike/' + recipientId, {})
    }

    getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>()

        let params = new HttpParams()

        params = params.append('MessageContainer', messageContainer)

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page)
            params = params.append('pageSize', itemsPerPage)
        }

        // specify return type to handle paginatedresult error
        return this.http
            .get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {
                observe: 'response',
                params,
            })
            .pipe(
                map((response) => {
                    paginatedResult.result = response.body
                    if (response.headers.get('Pagination') !== null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
                    }

                    return paginatedResult
                })
            )
    }

    getMessageThread(id: number, recipientId: number) {
        return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId)
    }

    sendMessage(id: number, message: Message) {
        return this.http.post(this.baseUrl + 'users/' + id + '/messages', message)
    }

    deleteMessage(id: number, userId: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {})
    }

    markAsRead(id: number, userId: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id + '/read', {}).subscribe()
    }
}
