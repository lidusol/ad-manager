import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { User_Role } from 'src/app/utils/data';
import { AuthService } from 'src/app/auth/auth.service';
import { CURRENCY, DEFAULT_LANG } from 'src/environments/environment';
import { PaymentService } from '../../services/payment.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Payment } from '../../models/payment.models';
import { CommandModel, ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import {take} from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adf-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private translate: TranslateService, private route: ActivatedRoute, private storageService: LocalStorageService, private router: Router, private auth: AuthService, private paymentService: PaymentService, private accountsService: AccountsService) { }
  public uid: string = ""
  public adf_account_id: string = ""
  public aacid: string = ""
  public user_access: User_Role;
  public accountValue: number = 0
  public transactions: Payment[] = []
  public commands: CommandModel[];
  public toolbarOptions: ToolbarItems[];
  public contextMenuItems: ContextMenuItem[];
  public gridLines: GridLine;
  public selectionOptions: SelectionSettingsModel;
  @ViewChild('appSnackBar', { static: false }) appSnackBar: SnackbarComponent;

  ngOnInit(): void {
     this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const adf_account_id: string = params['aacid'];
            const uid = params['auid'];
            const key = params['key'];
					 
            if (response.aacid === adf_account_id && uid === response.auid) {
              this.aacid = adf_account_id
              this.uid = response.auid
              this.user_access = response.role
              this.getTransactions(this.aacid)
             /*  if (key !== undefined) {
                this.aacid = adf_account_id
                this.uid = response.auid
                this.user_access = response.role
                this.accountValue = response.account.account_value
                this.auth.user.pipe(take(1)).subscribe(data => {
                  if (data.paymentKey.toString() === key.toString()) {
                     var montant = localStorage.getItem(key)
            if (montant === null) {
                this.router.navigate(['/accounts/transactions'], { queryParams: { aacid: response.aacid, auid: response.auid } })
            } else {
              var new_value = 0
              new_value = parseInt(montant)/CURRENCY.DOLLAR + this.accountValue
              this.paymentService.createTransaction(this.uid, response.aacid, response.account.name, data.email, "Rechargement", parseInt(montant)/CURRENCY.DOLLAR, params['key'], 0, "").then(paymentStatus => {
                if (paymentStatus === "ok") {
                  if (response.fromOwned) {
                    this.accountsService.updateAccount(response.aacid, { account_value: new_value }).then(set_value => {
                      if (set_value === "ok") {
                        this.openSnackBar(8, `Le compte ${response.account.name} a été rechargé avec succès, nouveau solde: ${new_value} $US`, 'ok', 'snack-success')
                        localStorage.removeItem(key)
                      }
                    })
                  } else {
                    this.accountsService.updateAccount(response.aacid, { account_value: new_value }).then(set_value => {
                      if (set_value === "ok") {
                        this.openSnackBar(8, `Le compte ${response.account.name} a été rechargé avec succès, nouveau solde: ${new_value} $US`, 'ok', 'snack-success')
                        localStorage.removeItem(key)
                      }
                    })
                  }
                }
              })
          
              } 
                  } else {
                    this.router.navigate(['/accounts/transactions'], { queryParams: { aacid: response.aacid, auid: response.auid } })
                  }
                })
              } else{
                this.aacid = adf_account_id
                this.uid = response.auid
                this.user_access = response.role
                this.getTransactions(this.aacid)
                
              } */
						  
					  } else {
						  this.router.navigate(['/accounts/transactions'], { queryParams: { aacid: response.aacid, auid: response.auid } })
					  }
			 
				 })
				
			}
     })
    
    this.commands = [{ type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } }];
     this.gridLines = 'Both';
    this.selectionOptions = { type: 'Multiple' };
    this.interval_refresh = setInterval(()=>{
			this.getLang()
		},500)
  }

  
  getLang(){
    this.storageService.getLang().then(lang=>{
      //console.log(lang)
      if(lang!==undefined && lang!==null && (lang==='en' || lang==='fr')){
        this.translate.use(lang);
      }else{
        this.translate.use(DEFAULT_LANG)
      }
    }).catch(e=>{
      this.translate.use(DEFAULT_LANG)
    })
    
    }

  interval_refresh: any;
  ngOnDestroy(): void {
	//Called once, before the instance is destroyed.
	//Add 'implements OnDestroy' to the class.
	if(this.interval_refresh!==undefined && this.interval_refresh!==null){
	  clearInterval(this.interval_refresh)
  
	}
  }

  getTransactions(accountId: string) {
    this.paymentService.getListTransaction(accountId).subscribe(transactions => {
      this.transactions = transactions
    })
  }

  openSnackBar(timeout: number, message: string, action: string, css: string) {
     this.appSnackBar.openSnackBar(timeout, message, action, css)
  }

   

}
