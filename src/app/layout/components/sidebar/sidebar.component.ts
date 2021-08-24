import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { NavItem, User_Role} from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { LayoutService } from '../../layout.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Browser } from '@syncfusion/ej2-base';
import { Observable, Subject } from 'rxjs';
import { SideMenuItemComponent } from '../single/side-menu-item/side-menu-item.component';

@Component({
  selector: 'adf-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoading = true
  navItems: NavItem[] = []
  aacid: string = ""
  auid: string = ""
  user_access: User_Role;
  @ViewChild(SideMenuItemComponent, {static: false}) sideMenuItem: SideMenuItemComponent
   constructor(media: MediaMatcher, private router: Router, private layoutService: LayoutService, private auth: AuthService, private storageService: LocalStorageService) { 
    this.sidebarSubject.subscribe((val)=>{
      this.toggleSidenav()
    })
   
  }
  @Output() mouseenter:  EventEmitter<boolean> = new EventEmitter<boolean>()
  sidebarSubject: Subject<string> = new Subject()
  onMouseEnter(arg: boolean){
    this.mouseenter.emit(arg)
  }
  navigationChanged = new Subject<boolean>()

  ngAfterViewInit(): void {
    //console.log(this.navigationChanged)
      this.navigationChanged.subscribe(value => {
       //console.log(value)
       if (value) {
          this.storageService.getUserIdAndAccountId().then(response => {
            this.aacid = response.aacid
            this.auid = response.auid
            this.user_access = response.role
      if (response !== null) {
   

            if (response.role.admin) {
             this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
              
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
     
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        
 
        
      
        
       
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
      
          ];
          this.isLoading = false
        } else {
          this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
    
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         
      

        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
      

        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'Redimensionner des images',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
      
   /*  {
          displayName: 'Campagne Facebook',
          iconName: '',
      route: '',
          href: 'https://social.adafri.com',
      queryParams: '',
          img: 'assets/svg/fb.svg'

        }, */
          ];
          this.isLoading = false
           }
          if (window.location.pathname === '/campaigns/new/select') {
         
       
          
    } else if(window.location.pathname==='/campaigns/new/display/create') {
           
          } else if (window.location.pathname==='/campaigns/list') {
         
          }else if (window.location.pathname==='/accounts/list') {
           
          }else if(window.location.pathname==='/campaigns/review/display' ) {
            if (response.role.admin) {
             this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
            
                   {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
                 
        
      
  
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'cmp_summary_main',
          iconName: 'assignment',
          route: 'campaigns/review/display',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'edit_cmp_review',
          iconName: 'build_circle',
          route: 'campaigns/settings/display',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
 
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        

        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
   
          ];
          this.isLoading = false
        } else {
          this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     

        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         
      
  
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
   
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'Redimensionner des images',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
          ];
          this.isLoading = false
           }
          }else if(window.location.pathname==='/campaigns/settings/display') {
            if (response.role.admin) {
             this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
             
                   {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
                
    
        
      
  
    

        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'cmp_summary_main',
          iconName: 'assignment',
          route: 'campaigns/review/display',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'edit_cmp_review',
          iconName: 'build_circle',
          route: 'campaigns/settings/display',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
 
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
     
        
   
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
     
        
     
    /* {
          displayName: 'Campagne Facebook',
          iconName: '',
      route: '',
          href: 'https://social.adafri.com',
      queryParams: '',
          img: 'assets/svg/fb.svg'

        }, */
          ];
          this.isLoading = false
          //this.toggleSidenav()
        } else {
          this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     

        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         
     
 
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
     

        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'Redimensionner des images',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        

        //     },
   /*  {
          displayName: 'Campagne Facebook',
          iconName: '',
      route: '',
          href: 'https://social.adafri.com',
      queryParams: '',
          img: 'assets/svg/fb.svg'

        }, */
          ];
          this.isLoading = false
          //this.toggleSidenav()
           }
          }else if(window.location.pathname==='/campaigns/review/native' ) {
            if (response.role.admin) {
             this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
                   {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'cmp_summary_main',
          iconName: 'assignment',
          route: 'campaigns/review/native',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'edit_cmp_review',
          iconName: 'build_circle',
          route: 'campaigns/settings/native',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
 
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
      
        
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        

          ];
          this.isLoading = false
          //this.toggleSidenav()
        } else {
         this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
   
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         
      
 
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
      
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
   /*  {
          displayName: 'Campagne Facebook',
          iconName: '',
      route: '',
          href: 'https://social.adafri.com',
      queryParams: '',
          img: 'assets/svg/fb.svg'

        }, */
          ];
          this.isLoading = false
          //this.toggleSidenav()
           }
          }else if(window.location.pathname==='/campaigns/settings/native') {
            if (response.role.admin) {
             this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
              
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'cmp_summary_main',
          iconName: 'assignment',
          route: 'campaigns/review/native',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'edit_cmp_review',
          iconName: 'build_circle',
          route: 'campaigns/settings/native',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
      
        
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
     

          ];
          this.isLoading = false
          //this.toggleSidenav()
        } else {
         this.navItems =	   [
    {
      displayName: 'overview',
      iconName: 'home',
      route: 'overview',
      queryParams: {aacid: response.aacid, auid: response.auid},
    },
     
 
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},

        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'Redimensionner des images',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
     
          ];
          this.isLoading = false
          //this.toggleSidenav()
           }
          }else if(window.location.pathname==='/campaigns/review/search' ) {
            if (response.role.admin) {
             this.navItems =	   [
        {
        displayName: 'overview',
        iconName: 'home',
        route: 'overview',
        queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
                   {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},
        
        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'cmp_summary_main',
          iconName: 'assignment',
          route: 'campaigns/review/search',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'edit_cmp_review',
          iconName: 'build_circle',
          route: 'campaigns/settings/search',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
        
          ];
          this.isLoading = false
          //this.toggleSidenav()
        } else {
         this.navItems =	   [
        {
        displayName: 'overview',
        iconName: 'home',
        route: 'overview',
        queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},
        
        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        /*  {
          displayName: 'Campagne Facebook',
          iconName: '',
        route: '',
          href: 'https://social.adafri.com',
        queryParams: '',
          img: 'assets/svg/fb.svg'
        
        }, */
          ];
          this.isLoading = false
          //this.toggleSidenav()
           }
          }else if(window.location.pathname==='/campaigns/settings/search') {
            if (response.role.admin) {
             this.navItems =	   [
        {
        displayName: 'overview',
        iconName: 'home',
        route: 'overview',
        queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
              
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'account_access.account_access_label',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},
        
        },
         {
          displayName: 'add_funds_label',
          iconName: 'account_balance_wallet',
           route: 'accounts/addFunds',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'new_cmp_label_side',
          iconName: 'add',
          // route: 'campaigns/new/select',
          // queryParams: {aacid: response.aacid, auid: response.auid},
          children: [
            {
              displayName: 'new_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
            {
              displayName: 'new_fb_cmp_label_side',
              iconName: 'add',
              route: 'campaigns/new/select-fb',
              queryParams: {aacid: response.aacid, auid: response.auid},
            },
          ],
        },
        {
          displayName: 'cmp_summary_main',
          iconName: 'assignment',
          route: 'campaigns/review/search',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'edit_cmp_review',
          iconName: 'build_circle',
          route: 'campaigns/settings/search',
          queryParams: {cid: response.cid, aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        
        
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'resize_label_side',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
        
        
          ];
          this.isLoading = false
          //this.toggleSidenav()
        } else {
         this.navItems =	   [
        {
        displayName: 'overview',
        iconName: 'home',
        route: 'overview',
        queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        
        {
          displayName: 'profile',
          iconName: 'account_circle',
          route: 'accounts/profile',
        },
        {
          displayName: 'Mes comptes',
          iconName: 'accessibility',
          route: 'accounts/list',
        },
        {
          displayName: 'transactions_label',
          iconName: 'analytics',
          route: 'accounts/transactions',
          queryParams: {aacid: response.aacid, auid: response.auid},
        
        },
        {
          displayName: 'my_campaigns_label',
          iconName: 'list_alt',
          route: 'campaigns/list',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        {
          displayName: 'logout',
          iconName: 'logout',
          route: 'logout',
          queryParams: {aacid: response.aacid, auid: response.auid},
        },
        
        // {
        //   displayName: 'my_ads_label',
        //   iconName: 'image_search',
        //   route: 'ads/list',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        //  {
        //   displayName: 'Redimensionner des images',
        //   iconName: 'image_aspect_ratio',
        //   route: 'ads/build',
        //   queryParams: {aacid: response.aacid, auid: response.auid},
        // },
        
        
          ];
          this.isLoading = false
          //this.toggleSidenav()
           }
          }else if(window.location.pathname==='/accounts/addFunds') {
           
          }else if(window.location.pathname==='/accounts/profile') {
            
          }else if(window.location.pathname==='/accounts/transactions') {
           
          }else if(window.location.pathname==='/overview') {
            
          }else if(window.location.pathname==='/auth/login') {
           
          }else if(window.location.pathname==='/select/account') {
            
          }else if(window.location.pathname==='/accounts/setup') {
           
          } else if (window.location.pathname==='/ads/list') {
            
          }else if (window.location.pathname==='/ads/build') {
            
          }else if (window.location.pathname==='/ads/create') {
            
          }
			   } else{
				  
			   }
		   })
     
       }
     })
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

       
    
  }
  ngOnInit(): void {
    
  }

  createCampaign() {
    this.router.navigate(['/campaigns/new/select'], {queryParams: {aacid: this.aacid, auid: this.auid}})
  }
  
  @Output() sideNavToggled: EventEmitter<boolean> = new EventEmitter()
  public toggle: boolean = true
  @Input() isMobile: boolean;
  @Input() showItemText: boolean = true
  toggleSidenav() {
    if(this.sideMenuItem!==undefined){

      if(this.isMobile){
        this.toggle = !this.toggle
        this.sideNavToggled.emit(this.toggle)
        this.showItemText = true
      }else{
        if (this.sideMenuItem.showItemText) {
          this.sideNavToggled.emit(false)
          this.showItemText = false
        } else{
          this.sideNavToggled.emit(true)
          this.showItemText = true
        }
      }
    }
  }
}