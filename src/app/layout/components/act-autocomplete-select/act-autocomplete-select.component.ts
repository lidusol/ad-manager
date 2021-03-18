import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, Subject} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Linked_ADAFRI_ACCOUNT, User_Role } from 'src/app/utils/data';
import { SERVER } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'adf-act-autocomplete-select',
  templateUrl: './act-autocomplete-select.component.html',
  styleUrls: ['./act-autocomplete-select.component.scss']
})
export class ActAutocompleteSelectComponent implements OnInit {
  filteredOptions: Observable<Linked_ADAFRI_ACCOUNT[]>;
  private _filter(value: string): Linked_ADAFRI_ACCOUNT[] {
    const filterValue = value.toLowerCase();
    return this.allAct.filter(act => act.account.name.toLowerCase().includes(filterValue));
  }
  actCtrl = new FormControl();
  filteredAct: Observable<Linked_ADAFRI_ACCOUNT[]>;
  act: Linked_ADAFRI_ACCOUNT = null;
  allAct: Linked_ADAFRI_ACCOUNT[] = []
  trigger: Subject<boolean> = new Subject<boolean>();
  isInit: boolean = true
  constructor(private storageService: LocalStorageService, private auth: AuthService) {
  this.trigger.pipe(take(1)).subscribe(val=>{
    this.filteredOptions = this.actCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.storageService.getUserIdAndAccountId().then(response=>{
      if(response!==undefined && response!==null){
        
        this.actCtrl.setValue(response.account.name)
        this.actCtrl.updateValueAndValidity()
        setTimeout(() => {
          var elelist = document.getElementById("input");
          if(elelist!==null){
            elelist.blur()
            // elelist.addEventListener('focus', function (){
            // this.focus()
            // })
          }
        }, 500);
     
      }
  })
  })
  this.auth.user.subscribe(data=>{
    this.uid = data.uid
  })
  
  }
  selectedAccount: Linked_ADAFRI_ACCOUNT = null
  buttonDisabled: boolean = true
  adf_account_id: string = ""
  adf_account_user_role: User_Role;
  uid: string = ''
  onAccountSelect(account: Linked_ADAFRI_ACCOUNT) {
    this.selectedAccount = account
   this.adf_account_id = this.selectedAccount.account.id
   this.adf_account_user_role = this.selectedAccount.role
   /*  this.buttonDisabled = false */
   this.goToDashBoard()
 }
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
  ngOnInit(){
    var elelist = document.getElementById("input");
    elelist.blur()
    // elelist.addEventListener("focus", function(){
    //     this.blur()
    // });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    
  }

  selected(el: Linked_ADAFRI_ACCOUNT): void {
    this.act = el
  }


}
