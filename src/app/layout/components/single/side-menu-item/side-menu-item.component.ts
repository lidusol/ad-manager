import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { NavItem } from 'src/app/utils/data';
import { LayoutService } from 'src/app/layout/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'adf-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss'],
   animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(90deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SideMenuItemComponent implements OnInit {
  @Input() showItemText: boolean;
  @Input() isMobile: boolean;
  showText: boolean;
  expanded: boolean = true;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  showItemTextFn(){
    // this.showText = true
  }
  hideItemTextFn(){
    // this.showText = false
  }
  constructor(public navService: LayoutService,
              public router: Router, private deviceService: DeviceDetectorService, private auth: AuthService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    /* translate.addLangs(['en', 'fr']);
	translate.setDefaultLang('en');
	translate.use('en'); */
  }

  ngOnInit() {
    
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
       /*  console.log(`Checking '/${this.item.route}' against '${url}'`); */
        /* url.indexOf(`/${this.item.route}`) === 0 */
        this.expanded = false;
        this.ariaExpanded = this.expanded;
        /* console.log(`${this.item.route} is expanded: ${this.expanded}`); */
      }
    });

  
  }

  onItemSelected(item: NavItem) {
    if(item.route==='logout'){
      this.auth.signOut()
    }else{
      if (item.href === undefined) {
        if (!item.children || !item.children.length) {
          if (item.queryParams !== undefined) {
            this.router.navigate([item.route], {queryParams: item.queryParams}).then(()=>{
             
            })
            
          } else{
            this.router.navigate([item.route]);
          }
          /* this.navService.closeNav(); */
        }
        if (item.children && item.children.length) {
          this.expanded = !this.expanded;
        }
        
      } else {
        window.location.replace(item.href)
      }

    }
  }

}
