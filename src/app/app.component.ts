import { Component } from '@angular/core';
import { HttpClient ,HttpHeaders } from  '@angular/common/http';
import { CdkDragDrop,moveItemInArray,transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Assignment3';
  constructor(private http:HttpClient){}
distancecost:any;
dropvehicle:any;
 orders :any[]=[];
 drivers :any[]=[];
 vehicles :any[]=[];

 ngOnInit(){
  this.getDriverData();
  this.getVehicleData();
  this.getOrderData();

 }
  onOrderDropped(order: any) {
    
  }

  // onVehicleDropped(event: CdkDragDrop<string[]>, order: any) {
    
  //   order.vehicle = this.vehicles[event.previousIndex];
    
  //   this.calculateOrderCost(order);
  // }
  onVehicleDropped(event: CdkDragDrop<string[]>, order: any) {
 
    const droppedVehicle = this.vehicles[event.previousIndex];
    
  
    if (!order.vehicle) {
      if ((droppedVehicle.vehicleType === 'H' && order.purpose === 'P') || (droppedVehicle.vehicleType === 'L' && order.purpose === 'G')) {

        order.vehicle = droppedVehicle;
        this.vehicles.splice(event.previousIndex, 1);
        this.calculateOrderCost(order);
      } else {
       
        alert("Vehicle not able to drop for this order.");
        event.currentIndex = event.previousIndex;
      }
    }
  }
  
  
  onDriverDropped(event: CdkDragDrop<string[]>, order: any) {
    const droppedDriver = this.drivers[event.previousIndex];
  
    if (!order.driver) {
      if ((droppedDriver.posessHeavyVehicleLicence && order.purpose === 'G') || (!droppedDriver.posessHeavyVehicleLicence && order.purpose === 'P')) {
        order.driver = droppedDriver;
        this.drivers.splice(event.previousIndex, 1);
        this.calculateOrderCost(order);
      } else {
        
        alert("Driver not able to drop for this order.");
        event.currentIndex = event.previousIndex;
      }
    } else {
      
    }
  }


  calculateOrderCost(order: any): number {
    if (!order.vehicle || !order.driver) {
      return 0;
    }
    const distanceCost = order.approxDistance * order.vehicle.perKMCost;
    this.distancecost= distanceCost;
    const driverCost = order.timeNeeded <= 8 ?
      order.driver.perDayRate :
      order.driver.perDayRate + (order.timeNeeded - 8) * order.driver.overtimeRate;

    const totalCost = distanceCost + driverCost;
    order.cost = totalCost;

    return totalCost;
   
  }
 drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
 
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    const droppedOrder:any = event.previousContainer.data[event.previousIndex];
    const droppedVehicle = droppedOrder.vehicle;
    const droppedDriver = droppedOrder.driver;
    if (event.container.id === 'vehicles') {
      const order = this.orders.find((order) => order.vehicle === droppedVehicle);
      if (order) {
        order.vehicle = null;  
        console.log(order) 
      }
      this.vehicles.push(droppedVehicle);
    }
     
    if (event.container.id === 'drivers') {
      const order = this.orders.find((order) => order.driver === droppedDriver);
      if (order) {
        order.driver = null; 
       
      }
      this.drivers.push(droppedDriver); 
    }
   
  }
}

  
  
  calculateTotalCost(): number {
    return this.orders.reduce((totalCost, order) => totalCost + (order.cost || 0), 0);
  }
  getDriverData(){
    
   
  
    this.http.get('http://ztraining.zeronetraining.local/api.publish/api/driver' ).subscribe(
      (data) => {
       
       
         this.drivers=this.drivers.concat(data);
       
       
     
      },
      (error) => {
        
       console.log (error);
      }
    );
  }
  getVehicleData(){
    
   
  
    this.http.get('http://ztraining.zeronetraining.local/api.publish/api/vehicle' ).subscribe(
      (data) => {
       
       
         this.vehicles=this.vehicles.concat(data);
       
       
     
      },
      (error) => {
        
       console.log (error);
      }
    );
  }
  getOrderData(){
    
   
  
    this.http.get('http://ztraining.zeronetraining.local/api.publish/api/travelorder' ).subscribe(
      (data) => {
       
       
         this.orders=this.orders.concat(data);
       
       
     
      },
      (error) => {
        
       console.log (error);
      }
    );
  }

}
