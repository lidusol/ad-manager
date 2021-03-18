import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'adf-campaigns-main-layout',
  templateUrl: './campaigns-main-layout.component.html',
  styleUrls: ['./campaigns-main-layout.component.scss']
})
export class CampaignsMainLayoutComponent implements OnInit {
    mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild('snav', {static: false}) snav: MatSidenav
  public opened: boolean = true
    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
     ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
  }

   toggleSideNav() {
       if (this.snav.opened) {
      this.snav.close()
    } else {
      this.snav.open()
    }
   }
 openSideNav() {
 if (this.snav.opened) {
      this.snav.close()
    } else {
      this.snav.open()
    }
   }

}
