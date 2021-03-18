import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'adf-campaigns-selector-type-layout',
  templateUrl: './campaigns-selector-type-layout.component.html',
  styleUrls: ['./campaigns-selector-type-layout.component.scss']
})
export class CampaignsSelectorTypeLayoutComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild('snav', {static: false}) snav: MatSidenav
  public opened: boolean = false
  public headerTitle: string = ''
    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
         this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          //console.log('start')
          break;
        }

        case event instanceof NavigationEnd: {
          if (window.location.pathname === '/campaigns-management/new/select') {
     this.headerTitle = 'Sélectionner un type de campagne'
    } else if(window.location.pathname==='/campaigns-management/new/display/create') {
       this.headerTitle = 'Nouvelle campagne display'
          }
          break;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          break;
        }
        default: {
          break;
        }
      }
    });
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
