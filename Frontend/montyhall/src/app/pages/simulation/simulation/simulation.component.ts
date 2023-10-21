import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormData } from 'src/app/models/form';
import { Response } from 'src/app/models/response';
import { Request } from 'src/app/models/request';
import { RevealRequest } from 'src/app/models/request';

@Component({
	selector: 'app-simulation',
	templateUrl: './simulation.component.html',
	styleUrls: ['./simulation.component.css']
})
export class SimulationComponent {

	model: FormData;

	constructor(private http: HttpClient) {
		this.model = {
			count: 100,
			switch: false
		}
	}

	winningPercentage: number = 0;
	wins: number = 0;
	async onFormSubmit() {
		this.wins = 0;
		this.winningPercentage = 0
		console.log(this.model);
		await this.initSimulation()
	}

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

	selectNewDoor(selected: number, opened: number): number {
		const id = Math.floor((Math.random() * 3) + 1);
		if (id === selected || id === opened){
			return this.selectNewDoor(selected, opened)
		}
		else {
			return id
		}
	}

	async initSimulation() {
		for (let i = 0; i < this.model.count; i++) {
			const select = Math.floor((Math.random() * 3) + 1);

			const result1 = await this.getMontyHallInstanceId()
			const instanceId: any = result1?.value

			const request: Request = {
				instanceId: instanceId,
				doorId: select
			}
			const result2 = await this.selectDoorRequest(request)
			if (result2?.value == "Selection Success"){
				const request: RevealRequest = {
					id: instanceId
				}
				const result: any = await this.revealDoorRequest(request)
				const doorId: number = parseInt(result?.value)

				if (this.model.switch == "true"){
					const newSelect = this.selectNewDoor(select, doorId)
					const request: Request = {
						instanceId: instanceId,
						doorId: newSelect
					}
					const result = await this.finalSelectRequest(request)
					if (result?.value == "Congratulations!!! You won the CAR :)"){
						this.wins++
					}
				}
				else {
					const request: Request = {
						instanceId: instanceId,
						doorId: select
					}
					const result = await this.finalSelectRequest(request)
					if (result?.value == "Congratulations!!! You won the CAR :)"){
						this.wins++
					}
				}
			}
			else {
				alert("Something went wrong")
				break;
			}
		}
		this.winningPercentage = this.wins/this.model.count * 100
	}
}
