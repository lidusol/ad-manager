import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'adf-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss']
})
export class EmailVerifiedComponent implements OnInit {
  mode: string = this.activatedActivated.snapshot.queryParams['mode'];
  code: string = this.activatedActivated.snapshot.queryParams['oobCode'];
  constructor(private activatedActivated: ActivatedRoute, private auth: AuthService,) { }

  ngOnInit(): void {
    this.auth.confirmEmail(this.code)
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

}
