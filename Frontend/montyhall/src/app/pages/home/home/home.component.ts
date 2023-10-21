import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Response } from 'src/app/models/response';
import { Request } from 'src/app/models/request';
import { RevealRequest } from 'src/app/models/request';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {

	constructor(
		private http: HttpClient
	) {

	}
	door1Img: string = "../../../../assets/door_closed.jpg"
	door2Img: string = "../../../../assets/door_closed.jpg"
	door3Img: string = "../../../../assets/door_closed.jpg"

	door1ButtonText: string = "Select"
	door2ButtonText: string = "Select"
	door3ButtonText: string = "Select"

	door1ButtonStatus: string = "enabled"
	door2ButtonStatus: string = "enabled"
	door3ButtonStatus: string = "enabled"

	getMontyHallInstanceId() {
		const url = 'https://localhost:7297/api/MontyHall/init';
		return this.http.get<Response>(url).toPromise()
	}

	selectDoorRequest(request: Request) {
		const url = 'https://localhost:7297/api/MontyHall/select';
		return this.http.post<Response>(url, request).toPromise();
	}

	revealDoorRequest(request: RevealRequest) {
		const url = 'https://localhost:7297/api/MontyHall/reveal';
		return this.http.post<Response>(url, request).toPromise();
	}

	finalSelectRequest(request: Request) {
		const url = 'https://localhost:7297/api/MontyHall/finalSelect'
		return this.http.post<Response>(url, request).toPromise();
	}

	async initGame() {
		this.door1Img = "../../../../assets/door_closed.jpg"
		this.door2Img = "../../../../assets/door_closed.jpg"
		this.door3Img = "../../../../assets/door_closed.jpg"

		this.door1ButtonText = "Select"
		this.door2ButtonText = "Select"
		this.door3ButtonText = "Select"

		this.door1ButtonStatus = "enabled"
		this.door2ButtonStatus = "enabled"
		this.door3ButtonStatus = "enabled"
		sessionStorage.setItem('isSelected', 'false')
		const result = await this.getMontyHallInstanceId()
		const instanceId: any = result?.value
		sessionStorage.setItem('instanceId', instanceId)
	}

	ngOnInit() {
		this.initGame();
	}

	async revealDoor() {
		const instanceId: any = sessionStorage.getItem('instanceId')
		const request: RevealRequest = {
			id: instanceId
		}
		const result: any = await this.revealDoorRequest(request)
		const doorId: number = parseInt(result?.value)
		switch (doorId){
			case 1:
				this.door1Img = "../../../../assets/door_opened.jpg";
				this.door1ButtonStatus = "disabled"
				break;
			case 2:
				this.door2Img = "../../../../assets/door_opened.jpg";
				this.door2ButtonStatus = "disabled"
				break;
			case 3:
				this.door3Img = "../../../../assets/door_opened.jpg";
				this.door3ButtonStatus = "disabled"
				break;
		}
		alert("Host have opened a door for you, and it has a goat. Now you can pick a door again :)")
	}

	async selectDoor(id: number) {
		const isSelected: any = sessionStorage.getItem("isSelected")
		if (isSelected == 'false') {
			const instanceId: any = sessionStorage.getItem('instanceId')
			const request: Request = {
				instanceId: instanceId,
				doorId: id
			}
			const result = await this.selectDoorRequest(request)
			if (result?.value == "Selection Success") {
				switch (id){
					case 1:
						this.door1ButtonText = "Selected"
						break;
					case 2:
						this.door2ButtonText = "Selected";
						break;
					case 3:
						this.door3ButtonText = "Selected";
						break;
				}
				sessionStorage.setItem('isSelected', 'true')
				await this.revealDoor()
			}
		}
		else {
			const instanceId: any = sessionStorage.getItem('instanceId')
			const request: Request = {
				instanceId: instanceId,
				doorId: id
			}
			switch (request.doorId) {
				case 1:
					this.door1Img = "../../../../assets/door_opened.jpg";
					break;
				case 2:
					this.door2Img = "../../../../assets/door_opened.jpg";
					break;
				case 3:
					this.door3Img = "../../../../assets/door_opened.jpg";
					break;
			}
			const result = await this.finalSelectRequest(request)
			alert(result?.value)
		}
	}
}
