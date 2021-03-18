import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { Account, Linked_ADAFRI_ACCOUNT, User_Role} from '../../../utils/data'
import { AuthService } from 'src/app/auth/auth.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SERVER } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ActAutocompleteSelectComponent } from '../act-autocomplete-select/act-autocomplete-select.component';
@Component({
  selector: 'adf-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss']
})
export class SelectAccountComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if(this.subscriptionOwned!==undefined){
      this.subscriptionOwned.unsubscribe()
    }
    if(this.subscriptionOther!==undefined){
      this.subscriptionOther.unsubscribe()
    }

  }
  @ViewChild(ActAutocompleteSelectComponent, {static: false}) selectActChip: ActAutocompleteSelectComponent
  @Input() showAutoComplete: boolean;
  accounts: Account[] = []
  listAccounts: Linked_ADAFRI_ACCOUNT[] = []
  selectedAccount: Linked_ADAFRI_ACCOUNT = null
  buttonDisabled: boolean = true
  adf_account_id: string = ""
  adf_account_user_role: User_Role = undefined;
  subscriptionOwned: Subscription
  subscriptionOther: Subscription
  currentAccountId: string = ''
  searchControl: FormControl = new FormControl('')
  loadingAccount: boolean = true
  @ViewChild('list', {static: false}) selectionList: MatSelectionList
  uid: string = ""
  onAccountSelect(account: Linked_ADAFRI_ACCOUNT) {
     this.selectedAccount = account
    this.adf_account_id = this.selectedAccount.account.id
    this.adf_account_user_role = this.selectedAccount.role
    /*  this.buttonDisabled = false */
    this.goToDashBoard()
  }
  constructor(private translate: TranslateService,  private auth: AuthService, private accountsService: AccountsService, private router: Router, private storageService: LocalStorageService, private cd: ChangeDetectorRef) {
    translate.addLangs(['en', 'fr']);
   }

  ngOnInit(): void {
    //////console.log('init')
    this.storageService.getUserIdAndAccountId().then(data => {
      ////console.log(data)
      if (data !== null && data !== undefined) {
         this.currentAccountId = data.account.id
      } 
      this.auth.getUserCredential().then(credential => {
            //console.log(credential)
         if (credential !== null && credential!==undefined) {
           this.uid = credential.uid
           ////console.log(this.uid)
           this.listAccounts = []
           this.accountDisplay = []
           this.subscriptionOwned = this.accountsService.getListAccounts(this.uid).subscribe(accounts => {
             //////console.log(accounts)
             this.accounts = accounts
             this.listAccounts = [...this.listAccounts, ...[{account: accounts[0],  role: { admin: true, readOnly: false }}]]
             /* this.accounts.forEach((account) => {
               this.listAccounts.push({ account: account, role: { admin: true, readOnly: false } })
                   
              }) */
             this.subscriptionOther = this.accountsService.getListActiveLink(this.uid).subscribe(active_accounts_linked => {
                  //console.log(active_accounts_linked)
                           if (active_accounts_linked.length > 0) {
                             for (let link of active_accounts_linked) {
                               let account: Linked_ADAFRI_ACCOUNT = link.linked_account
                               
                               this.listAccounts = [...this.listAccounts, ...[account]]
                               this.accountDisplay = this.listAccounts
                               if(this.showAutoComplete){
                                 this.selectActChip.allAct = this.accountDisplay
                                 this.selectActChip.trigger.next(true)
                               }
                            this.loadingAccount = false
                               }
                           } else {
                             this.accountDisplay = this.listAccounts
                             if(this.showAutoComplete){
                              this.selectActChip.allAct = this.accountDisplay
                              this.selectActChip.trigger.next(true)
                            }
                             this.loadingAccount = false
                             
                             }
                         })
           })
           
           /* this.accountsService.getListAccounts(credential.uid).subscribe(accounts => {
             this.uid = credential.uid
             this.accounts = accounts
           }) */
         } else {
           
         }
       })
      })
  
  }
  selectedItem(account: Linked_ADAFRI_ACCOUNT): Boolean {
    return this.listAccounts.some(account_ =>account_.account.id === account.account.id && account_.account.id === this.currentAccountId)
  }

  accountDisplay: Linked_ADAFRI_ACCOUNT[] = []
  searchAccount(searchItem: string) {
    if (searchItem.length > 0) {
      let result: Linked_ADAFRI_ACCOUNT[] = [] 
      result = this.listAccounts.filter(account => account.account.name.includes(searchItem))
      if (result.length > 0) {
        this.accountDisplay=result
      } else {
        this.accountDisplay = []
      }
      
    } else {
       this.accountDisplay = this.listAccounts
    }
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.searchControl.valueChanges.subscribe(value => {
       this.searchAccount(value)
    })
    setTimeout(() => {
      
     /*  this.storageService.getUserIdAndAccountId().then(data => {
        this.selectionList.options.forEach(item => {
          if (item.value.account.id === data.account.id) {
            item.selected = true
          }
        })
      }) */
      /* if (window.location.pathname === '/select/account') {
        this.mode = ['card-account-select']
        this.cd.detectChanges()
      } else {
        this.mode = ['card-account-select-poppup']
        this.cd.detectChanges()
      } */
      
    }, 1000);
     
  }

  public mode: any = ['card-account-select']
  goToDashBoard() {
    if (this.uid !== "" && this.adf_account_id !== "" && this.adf_account_user_role !== undefined) {
      this.storageService.setUserIdAndAccountId(this.uid, this.adf_account_id, this.adf_account_user_role).then(set_user_and_account => {
                  if (set_user_and_account === "ok") {
                    window.location.replace(SERVER.url_redirect+`/overview?aacid=${this.adf_account_id}&auid=${this.uid}`)
                    // this.router.navigate(['/overview'], { queryParams: { aacid: this.adf_account_id, auid: this.uid } }).then(() => {
                    //   window.location.reload()
                    // })
                    
                  }
                })
              }
      
    }


}
