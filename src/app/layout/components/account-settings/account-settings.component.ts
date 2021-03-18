import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/utils/data';
import { AuthService } from 'src/app/auth/auth.service';
import {Account} from '../../../utils/data'
import { AccountsService } from 'src/app/accounts/accounts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'adf-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  
  nom: FormControl = new FormControl('', [Validators.required])
  prenom: FormControl
  user: User;
  uid: string =""
  favoriteSeason: string;
  ownedAccount: Account = undefined
  seasons: string[] = ['Entreprise', 'Particulier'];
  constructor(private auth: AuthService, private fb: FormBuilder, private accountsService: AccountsService, private route: ActivatedRoute) { 
    
  }
    step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  aacid: string = ""

  getQueryParams(): Promise<string>{
    return new Promise(resolve => {
      this.route.queryParams.subscribe((params: any) => {
      this.aacid = params['aacid'];
        this.uid = params['auid'];
        if (this.aacid !== '' && this.uid !== '') {
          resolve('ok')
        } else {
          resolve('error')
        }
    })
    })
  }
  getAccount(): Promise<string>{
    return new Promise(resolve => {
      this.getQueryParams().then(getParams => {
        if (getParams === 'ok') {
          this.accountsService.getAct(this.aacid).valueChanges().subscribe(account => {
            if (account !== null && account.name !== undefined) {
              this.ownedAccount = { id: this.aacid, ...account }
              this.nom.setValue(account.name)
              resolve('ok')
            } else {
              resolve('error')
            }
          })
        } else {
          resolve('error')
        }
      })
    })
  }
  ngOnInit(): void {
   
   
  }
  isLoading: boolean = true
  ngAfterViewInit(): void {
    this.getAccount().then(res_get_account => {
      if (res_get_account === 'ok') {
        this.isLoading = false
      }
    })
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
 
  }
  showSpinnerAccountName: boolean = false
  saveAccountName(): Promise<string> {
    return new Promise(resolve => {
      this.showSpinnerAccountName = true
      
      this.accountsService.updateAccount(this.aacid, {name: this.nom.value}).then(res_update => {
        if (res_update === "ok") {
          resolve('ok')
          this.showSpinnerAccountName = false
        } else {
          resolve('error')
          this.showSpinnerAccountName = false
        }
      }).catch(e => {
         resolve('error')
          this.showSpinnerAccountName = false
      })
      
    })
  }

  public confirmAll(): Promise<string>{
    return new Promise(resolve => {
      this.saveAccountName().then(res_save_account_name => {
        if (res_save_account_name === "ok") {
            resolve("ok")
        } else{
         resolve("Nom du compte incorrect")
        }
      }).catch((e) => {
        resolve("Nom du compte incorrect")
      })
    })
  }


}
