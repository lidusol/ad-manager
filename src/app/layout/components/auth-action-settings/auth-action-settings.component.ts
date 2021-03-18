import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'adf-auth-action-settings',
  templateUrl: './auth-action-settings.component.html',
  styleUrls: ['./auth-action-settings.component.scss']
})
export class AuthActionSettingsComponent implements OnInit {
  constructor(private activatedActivated: ActivatedRoute, private auth: AuthService, private router: Router) {}
  mode: string = this.activatedActivated.snapshot.queryParams['mode'];
  code: string = this.activatedActivated.snapshot.queryParams['oobCode'];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(this.code!=='' &&  (this.mode==="verifyEmail" || this.mode==='resetPassword')){ 
      return;
    }else{
      this.router.navigate(['/auth/login'])
    }
  }

}
