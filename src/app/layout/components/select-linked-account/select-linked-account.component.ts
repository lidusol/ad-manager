import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'adf-select-linked-account',
  templateUrl: './select-linked-account.component.html',
  styleUrls: ['./select-linked-account.component.scss']
})
export class SelectLinkedAccountComponent implements OnInit {
  @ViewChild('dialogSelectAccount', { static: false }) dialogSelectAccount: DialogComponent;
   public visible: boolean = false
  public isModal: boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  public linkedAccounts: any = []
  public currentAccountSelectedId: string = ""
  public customerToUse: number = 0
 @Output() clientId: EventEmitter<number> = new EventEmitter<number>();
  constructor(private accountsService: AccountsService) { 
    this.accountsService.getAdwordsAccountsLinkedFirebase().then(linked_accounts_status => {
      if (linked_accounts_status === "ok") {
        this.linkedAccounts = this.accountsService.accountsLinked
      }
    })
  }

  showDialog() {
    this.dialogSelectAccount.show()
  }
   hideDialog() {
    this.dialogSelectAccount.show()
  }

  ngOnInit(): void {
  }

  selectAccount() {
    this.clientId.emit(this.customerToUse)
  }
  onAccountSelect(event: MatSelectionListChange) {
    this.customerToUse = event.option.value
    
  }

}
