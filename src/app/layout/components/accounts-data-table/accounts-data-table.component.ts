import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { GridComponent, ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

import { AuthService } from 'src/app/auth/auth.service';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { SeoService } from 'src/app/seo.service';

@Component({
  selector: 'adf-accounts-data-table',
  templateUrl: './accounts-data-table.component.html',
  styleUrls: ['./accounts-data-table.component.scss']
})
export class AccountsDataTableComponent implements OnInit {
  @ViewChild('gridAccounts', { static: false }) gridAccounts: GridComponent
  public accounts: any;
  public toolbarOptions: ToolbarItems[];
  public contextMenuItems: ContextMenuItem[];
  public gridLines: GridLine;
  public selectionOptions: SelectionSettingsModel;
  @ViewChild('dialogConfirmDelete', { static: false }) dialogConfirmDelete: DialogComponent;
  @ViewChild('appSnackbar', {static: false}) appSnackbar: SnackbarComponent 
  public visible: boolean = false
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  constructor(private auth: AuthService, private accountsService: AccountsService, private seo: SeoService) {
    /*  this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Tous les comptes', // Title Suffix
      description: 'Comptes adafri', // Description
      image: '', // Image
      keywords: 'compte publicité, publicité sénégal' // Keywords
    }); */
   }
    public dReady: boolean = false;
    public dtTime: boolean = false;
    public isDataBound: boolean = false;
    public isDataChanged: boolean = true;
    public intervalFun: any;
    public clrIntervalFun: any;
    public clrIntervalFun1: any;
    public clrIntervalFun2: any;    
    public dropSlectedIndex: number = null;
    public stTime: any;
    public data: Object;
    public filter: Object;
    public filterSettings: Object;
    public selectionSettings: Object;  
    public height: string = '240px';
    @ViewChild('sample') 
    public listObj: DropDownListComponent;
    @ViewChild('gridAccounts')
    public gridInstance : GridComponent ;  
    public fields: Object = { text: 'text', value: 'value' };
    public item: number[] = [1, 2, 3, 4, 5];  

  getLinkedAccounts() {
    this.gridAccounts.showSpinner()
    this.auth.getUserCredential().then(cred => {
      if (cred) {
        if (cred.linkedAccounts !== 'undefined') {
          this.data = cred.linkedAccounts
          this.gridAccounts.hideSpinner()
          
        } else {
          this.gridAccounts.hideSpinner()
        }
      } else {
        this.gridAccounts.hideSpinner()
      }
    })
  }
  public ngOnInit(): void {
    this.auth.getUserCredential().then(cred => {
      if (cred) {
        if (cred.linkedAccounts !== 'undefined') {
          this.data = cred.linkedAccounts
          
        }
      //console.log(this.data)
        this.filterSettings = { type: "Menu" };      
        this.filter = { type: "CheckBox" };    
       this.stTime = performance.now();
        this.selectionSettings = {persistSelection: true, type: "Single", checkboxOnly: true };
       
      this.gridLines = 'Both';
        this.selectionOptions = { type: 'Multiple' };
        this.toolbarOptions = ['Search', 'ColumnChooser'];
        this.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage',
          'LastPage', 'NextPage'];
        }
      })
      
      }
  selectedAccounts: any; 
  public showProgress: boolean = false
  selectedAccount(args: RowSelectEventArgs) {
    
    //console.log(args)
    this.selectedAccounts=args.data
    
    //console.log(this.selectedAccounts)
  }
  public deletingAccounts: boolean = false
  buttonDeleteDisabled: boolean = false
  buttonCancelDisabled: boolean = false
   deleteAccounts() {
     this.deletingAccounts = true
     this.showProgress = true
     this.buttonCancelDisabled = true
     this.buttonDeleteDisabled = true
     this.accountsService.cancelLink(this.selectedAccounts.customerId).then(res_cancel => {
       if (res_cancel === "ok") {
          this.deletingAccounts = false
     this.showProgress = false
     this.buttonCancelDisabled = false
         this.buttonDeleteDisabled = false
         this.dialogConfirmDelete.hide()
       } else {
             this.deletingAccounts = false
     this.showProgress = false
     this.buttonCancelDisabled = false
         this.buttonDeleteDisabled = false
       }
     })

  }
    
  ngAfterViewInit(args: any): void {
      
        this.gridInstance.on('data-ready', function () {
            this.dReady = true;
        });
       /*  document.getElementById('gridAccounts').addEventListener('DOMSubtreeModified', () => {  
            if (this.stTime && this.isDataChanged) {
                let msgEle = document.getElementById('msg');
                let val: any = (performance.now() - this.stTime).toFixed(0);
                this.stTime = null;                
                this.dtTime = false;
                this.isDataChanged = false;
                msgEle.innerHTML = 'Load Time: ' + "<b>" + val + "</b>" + '<b>ms</b>';
                msgEle.classList.remove('e-hide')
           }
            }) */
    }
    valueChange(args:any): void {
		this.listObj.hidePopup();	
        this.gridInstance.showSpinner();
        this.dropSlectedIndex = null;
         let index: number = this.listObj.value as number;         
         clearTimeout(this.clrIntervalFun2);
         this.clrIntervalFun2 = setTimeout(() => {
             this.isDataChanged = true;
             this.stTime = null;
             let contentElement: Element = this.gridInstance.contentModule.getPanel().firstChild as Element;
             contentElement.scrollLeft = 0;
             contentElement.scrollTop = 0;
             this.gridInstance.pageSettings.currentPage = 1;
             this.stTime = performance.now();
            
             this.gridInstance.hideSpinner();     
         }, 100);
    }
    onDataBound(args:any):void {
        clearTimeout(this.clrIntervalFun);
        clearInterval(this.intervalFun);
        this.dtTime = true;
    }


}
