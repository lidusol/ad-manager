import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'adf-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.scss']
})
export class ResetPasswordRequestComponent implements OnInit {

  email: FormControl = new FormControl('', [Validators.required, Validators.email])
  resetErrorMessage: string = ""
  resetSuccessfullMessage: string = ""
  showSpinnerEmailReset: boolean = false
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  emailReset(){
    this.showSpinnerEmailReset = true
    this.resetSuccessfullMessage = ""
      this.resetErrorMessage = ""
    if(this.email.valid){
      this.auth.getUserEmail(this.email.value).then(response=>{
        if(response.message==='not ok'){
          this.auth.sendResetPasswordLink(this.email.value).then(sended=>{
            if(sended==="ok"){
              this.showSpinnerEmailReset = false
              this.email.reset()
              this.resetSuccessfullMessage = "Le lien de réinitialisation de votre mot de passe a été envoyé avec succès."
              this.resetErrorMessage = ""
            }else{
              this.showSpinnerEmailReset = false
              this.resetErrorMessage = "Oups une erreur est survenue veuillez réessayer .... !"
              this.resetSuccessfullMessage = ""
            }
          }).catch(e=>{
            this.resetErrorMessage = "Oups une erreur est survenue .... !"
          })

        }else{
          this.resetErrorMessage = "Aucun utilisateur n'a été enregistré sur cette email."
          this.showSpinnerEmailReset = false
        }
      }).catch(err=>{
        this.resetErrorMessage = "Oups .... !"
        this.showSpinnerEmailReset = false
      })

    }else{
      this.showSpinnerEmailReset = false
      this.resetErrorMessage = "Veuillez saisir une adresse email valide."
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.email.valueChanges.subscribe(value=>{
      this.resetSuccessfullMessage = ""
      this.resetErrorMessage = ""
    })
  }

}
