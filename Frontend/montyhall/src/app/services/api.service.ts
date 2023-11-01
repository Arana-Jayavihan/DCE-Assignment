import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Response } from 'src/app/models/response';
import { Request } from 'src/app/models/request';
import { RevealRequest } from 'src/app/models/request';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(private http: HttpClient) {

    }
    baseUrl: string = 'https://localhost:7297/api/MontyHall/'
    getMontyHallInstanceId() {
        const url = this.baseUrl + "init";
        return this.http.get<Response>(url).toPromise()
    }

    selectDoorRequest(request: Request) {
        const url = this.baseUrl + "select";
        return this.http.post<Response>(url, request).toPromise();
    }

    revealDoorRequest(request: RevealRequest) {
        const url = this.baseUrl + "reveal";
        return this.http.post<Response>(url, request).toPromise();
    }

    finalSelectRequest(request: Request) {
        const url = this.baseUrl + "finalSelect";
        return this.http.post<Response>(url, request).toPromise();
    }
}
