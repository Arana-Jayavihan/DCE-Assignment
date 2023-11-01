import { Component } from '@angular/core';
import { FormData } from 'src/app/models/form';
import { Request } from 'src/app/models/request';
import { RevealRequest } from 'src/app/models/request';
import { APIService } from 'src/app/services/api.service';

@Component({
	selector: 'app-simulation',
	templateUrl: './simulation.component.html',
	styleUrls: ['./simulation.component.css']
})
export class SimulationComponent {

	model: FormData;

	constructor(private service: APIService) {
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

			const result1 = await this.service.getMontyHallInstanceId()
			const instanceId: any = result1?.value

			const request: Request = {
				instanceId: instanceId,
				doorId: select
			}
			const result2 = await this.service.selectDoorRequest(request)
			if (result2?.value == "Selection Success"){
				const request: RevealRequest = {
					id: instanceId
				}
				const result: any = await this.service.revealDoorRequest(request)
				const doorId: number = parseInt(result?.value)

				if (this.model.switch == "true"){
					const newSelect = this.selectNewDoor(select, doorId)
					const request: Request = {
						instanceId: instanceId,
						doorId: newSelect
					}
					const result = await this.service.finalSelectRequest(request)
					if (result?.value == "Congratulations!!! You won the CAR :)"){
						this.wins++
					}
				}
				else {
					const request: Request = {
						instanceId: instanceId,
						doorId: select
					}
					const result = await this.service.finalSelectRequest(request)
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
