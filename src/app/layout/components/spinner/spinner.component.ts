import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent,createSpinner, showSpinner, hideSpinner, PositionDataModel} from '@syncfusion/ej2-angular-popups';


@Component({
  selector: 'adf-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @ViewChild('ejDialog', { static: false }) spinnerDialog: DialogComponent
  public message: string = "Chargement..."
  constructor() { }
  public showCloseIcon: boolean = true
  public progressValue: number = 0
  public isPublication: boolean = false
   public visible: Boolean = true;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  ngOnInit() {
      
  }

  /* showLoader() {
     showSpinner(document.getElementById('spinner'));

   
  } */
  ngAfterViewInit(): void {
   
  }
 /*  createLoader() {
    createSpinner({
     
           target: document.getElementById('spinner'),
          
    }); 
  }
  hideLoader() {
    hideSpinner(document.getElementById('spinner'));
  } */

}
