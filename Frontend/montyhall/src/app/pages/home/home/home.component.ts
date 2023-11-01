import { Component } from '@angular/core';
import { Request } from 'src/app/models/request';
import { RevealRequest } from 'src/app/models/request';
import { APIService } from 'src/app/services/api.service';
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {

	constructor(
		private service: APIService
	) {

	}
	door1Img: string = "../../../../assets/door_closed.jpg"
	door2Img: string = "../../../../assets/door_closed.jpg"
	door3Img: string = "../../../../assets/door_closed.jpg"

	door1ButtonText: string = "Select"
	door2ButtonText: string = "Select"
	door3ButtonText: string = "Select"

	async initGame() {
		this.door1Img = "../../../../assets/door_closed.jpg"
		this.door2Img = "../../../../assets/door_closed.jpg"
		this.door3Img = "../../../../assets/door_closed.jpg"

		this.door1ButtonText = "Select"
		this.door2ButtonText = "Select"
		this.door3ButtonText = "Select"

		sessionStorage.setItem('isSelected', 'false')
		const result = await this.service.getMontyHallInstanceId()
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
		const result: any = await this.service.revealDoorRequest(request)
		const doorId: number = parseInt(result?.value)
		switch (doorId){
			case 1:
				this.door1Img = "../../../../assets/door_opened.jpg";
				this.door1ButtonText = "Revealed"
				break;
			case 2:
				this.door2Img = "../../../../assets/door_opened.jpg";
				this.door2ButtonText = "Revealed"
				break;
			case 3:
				this.door3Img = "../../../../assets/door_opened.jpg";
				this.door3ButtonText = "Revealed"
				break;
		}
		alert("Monty have opened a door for you, and it has a goat. Now you can pick a door again :)")
	}

	async selectDoor(id: number) {
		const isSelected: any = sessionStorage.getItem("isSelected")
		if (isSelected == 'false') {
			const instanceId: any = sessionStorage.getItem('instanceId')
			const request: Request = {
				instanceId: instanceId,
				doorId: id
			}
			const result = await this.service.selectDoorRequest(request)
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
			const result = await this.service.finalSelectRequest(request)
			console.log(result)
			if (result?.value != "Door Already Opened"){
				switch (request.doorId) {
					case 1:
						this.door1Img = "../../../../assets/door_opened.jpg";
						this.door1ButtonText = "Opened"
						break;
					case 2:
						this.door2Img = "../../../../assets/door_opened.jpg";
						this.door2ButtonText = "Opened"
						break;
					case 3:
						this.door3Img = "../../../../assets/door_opened.jpg";
						this.door3ButtonText = "Opened"
						break;
				}
			}
			alert(result?.value)
		}
	}
}
