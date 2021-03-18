import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User, User_Role } from 'src/app/utils/data';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import {take} from 'rxjs/operators'
@Component({
  selector: 'adf-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  nom: FormControl
  prenom: FormControl
  user: User;
  uid: string =""
  favoriteSeason: string;
  aacid: string = ""
  user_access: User_Role;
  seasons: string[] = ['Entreprise', 'Particulier'];
  constructor(private auth: AuthService, private fb: FormBuilder, private storageService: LocalStorageService, private route: ActivatedRoute, private router: Router) { 
    
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
  ngOnInit(): void {
    this.auth.user.pipe(take(1)).subscribe(data => {
      if (data !== null) {
        this.user = data
        this.uid = data.uid
         this.nom = new FormControl(this.user.first_name, [Validators.required]),
          this.prenom = new FormControl(this.user.last_name, [Validators.required])
      
      }
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
 setTimeout(() => {
		  this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const adf_account_id: string = params['aacid'];
					  const uid = params['auid'];
					 
					  if (response.aacid === adf_account_id && uid === response.auid) {
						  this.aacid == adf_account_id
						  this.uid = response.auid
						  this.user_access = response.role
					  } else {
						  this.router.navigate(['/accounts/profile'], { queryParams: { aacid: response.aacid, auid: response.auid } });
						 
					  }
			 
				 })
				
			}
		})
      
    }, 500);
  }

  saveNameFirstName() {
    
    this.auth.updateUser(this.uid, { first_name: this.nom.value, last_name: this.prenom.value }).then(res_update => {
      if (res_update === "ok") {
      
      }
    })
  }

}
