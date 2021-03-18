import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'adf-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private activatedActivated: ActivatedRoute, private auth: AuthService, private router: Router) {}
  code: string = this.activatedActivated.snapshot.queryParams['oobCode'];
  resetError: string = ""
  password: FormControl = new FormControl('', [Validators.required])
  confirmPassword: FormControl = new FormControl('', [Validators.required])
  showSpinnerReset: boolean = false
  resetPassword(){
    this.showSpinnerReset = true
    if(this.password.valid && this.confirmPassword.valid){
      if(this.password.value===this.confirmPassword.value){
        this.auth.confirmResetPassword(this.code, this.password.value).then(value=>{
          if(value==='ok'){
            this.showSpinnerReset = false
            this.router.navigate(['/auth/login'])
          }else{
            this.resetError = value
            this.showSpinnerReset = false
          }
        }).catch(e=>{
          this.resetError = e.toString()
          this.showSpinnerReset = false
        })
      }else{
        this.resetError = "Les mots de passes ne sont pas identiques."
        this.showSpinnerReset = false
      }
    }else{
      this.resetError = "Veuillez rensigner tous les champs."
      this.showSpinnerReset = false
    }
  }
  ngOnInit(): void {
  }

  

}
