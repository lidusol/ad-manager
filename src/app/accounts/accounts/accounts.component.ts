import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { SnackbarComponent } from 'src/app/layout/components/snackbar/snackbar.component';
import { AccountsDataTableComponent } from 'src/app/layout/components/accounts-data-table/accounts-data-table.component';

interface FoodNode {
  name: string;
  customerId: number;
  childs?: FoodNode[];
  currenyCode?: string;
  canManageClients?: boolean;
  dateTimeZone?: string;
  testAccount?: boolean
}



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  customerId: number;
  account?: FoodNode
}

@Component({
  selector: 'adf-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  public accounts: any;
  constructor(private accountsService: AccountsService, private activatedRoute: ActivatedRoute, private router: Router) {
    
   }
  @ViewChild('dialogTreeAct', { static: false }) dialogTreeAct: DialogComponent;
  @ViewChild('appSnackbar', { static: false }) appSnackbar: SnackbarComponent 
  @ViewChild('dataTableAccounts', {static: false}) dataTableAccounts: AccountsDataTableComponent
  public visible: boolean = false
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };


   private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.childs && node.childs.length > 0,
      name: node.name,
      level: level,
      customerId: node.customerId,
      account: node
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.childs);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  public accountsPending: any = []
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit(): void {
    
    this.accountsService.getAdwordsAccountsFirebase().then(res_cred => {
      if (res_cred === "ok") {
        this.dataSource.data = this.accountsService.account
        this.accountsPending = this.accountsService.account
      }
    })
    
    this.getLinkedAccountsFromFirebase()
    
  }

  public getLinkedAccountsFromFirebase() {
  
    this.accountsService.getAdwordsAccountsLinkedFirebase().then(res_cred => {
      if (res_cred === "ok") {
        this.accounts = this.accountsService.account
      }
    })
  }
 
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
        this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
          if (code !== undefined) {
            this.dialogTreeAct.show()
        this.accountsService.updateUserAuthCode(code).then(res_update_auth_code => {
          if (res_update_auth_code === "ok") {
            this.dialogTreeAct.show()
            this.accountsService.getAdwordsUserCredentials().then(res_getting_credentials => {
              if (res_getting_credentials === "ok") {
                this.accountsService.getAdwordsAccounts().then(res_get_accounts => {
                  if (res_get_accounts === 'ok') {
                    this.accountsService.getAdwordsAccountsFirebase().then(res_cred => {
                      if (res_cred === "ok") {
        
        this.dataSource.data = this.accountsService.account
        this.accounts = this.accountsService.account
                        this.accountsPending = this.accountsService.account
                       
      }
    })
                  }
                })
              }
            })
          } else {
            
            this.router.navigate(['/accounts'])
          }
        })
         
      }
    });
  }
  requestAccess() {
    this.accountsPending = []
    this.accountsService.getAdwordsAccessAccounts()

  }
  openDialogAccount() {
    this.dialogTreeAct.show()
  }

  getActs() {
    this.accountsService.getAdwordsAccounts()
  }
  
  treeRootClick(name: string, customerId: number) {
    this.currentTreeSelectedId = ""
    this.cutomerToLink = 0
    this.fullAccountData = []
  }
  public currentTreeSelectedId: string = ""
  public buttonLinkDisabled: boolean = true
  public cutomerToLink: number = 0
  public showProgress: boolean = false
  public fullAccountData: any;
  
  treeSingle(name: string, customerId: number, account: any) {
    console.log(account)
    if (this.currentTreeSelectedId===customerId.toString()) {
      return;
      
    } else if (this.currentTreeSelectedId !== customerId.toString()) {
      if (this.currentTreeSelectedId === '') {
          this.currentTreeSelectedId = customerId.toString()
      document.getElementById(this.currentTreeSelectedId).classList.add('active')
      } else {
        document.getElementById(this.currentTreeSelectedId).classList.remove('active')
        this.currentTreeSelectedId = customerId.toString()
         document.getElementById(this.currentTreeSelectedId).classList.add('active')
      }
      
      
    }
    this.fullAccountData = account
    this.cutomerToLink = customerId
  }

  linkAccountToManager() {
    this.showProgress = true
    this.sendInvitation().then(sending_status => {
      if (sending_status === "ok") {
        this.acceptInvitation().then(accepting_status => {
          if (accepting_status === "ok") {
            this.accountsService.saveLinkedAccount(this.fullAccountData).then(res_saving_account => {
              if (res_saving_account === "ok") {
                this.showProgress = false
                this.dialogTreeAct.hide()
                this.appSnackbar.openSnackBar(8, "Compte lié avec succès !", "ok", "snack-success")
                 this.dataTableAccounts.getLinkedAccounts()
                
              }
            })
          } else {
            this.showProgress = false
            this.appSnackbar.openSnackBar(8, "Erreur lors de la liaison", "réessayer", "snack-error")
          }
        }).catch((e) => {
          this.showProgress = false
        })
      } else {
        this.showProgress = false
        console.log('error when sending')
      }
    }).catch((e) => {
      this.showProgress = false
    })
  }

  sendInvitation(): Promise<string>{
    return new Promise(resolve => {
      resolve('ok')
      this.accountsService.sendInvitation(this.cutomerToLink).then(res => {
        if (res === "ok") {
          resolve('ok')
        } else {
          resolve('error')
        }
      }).catch((e) => {
        resolve('error')
      })
      
    })
  }

   acceptInvitation(): Promise<string>{
    return new Promise(resolve => {
      this.accountsService.acceptInvitation(this.cutomerToLink).then(res => {
        if (res === "ok") {
          resolve('ok')
        } else {
          resolve('error')
        }
      }).catch((e) => {
        resolve('error')
      })
      
    })
  }
}
