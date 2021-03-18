import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { Browser } from '@syncfusion/ej2-base';

import { AuthService } from 'src/app/auth/auth.service';
import { SeoService } from 'src/app/seo.service';

import { Observable, Subject } from 'rxjs';

import { LayoutService } from '../../layout.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessagingService } from '../../services/messaging.service';
import { speedDialFabAnimations } from '../../speed-dial-fab/speed-dial-fab.animations';
import { LocalStorageService } from '../../services/local-storage.service';
import { DEFAULT_LANG } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../lang.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { SizeDetectorComponent } from '../size-detector/size-detector.component';
import { ResizeService } from '../size-detector/resize.service';


@Component({
  selector: 'adf-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
   animations: speedDialFabAnimations,
   
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  toolbarFixed: boolean = false

    loading = false
    mobileQuery: MediaQueryList;
    parentContainerPadding: boolean = true
  private _mobileQueryListener: () => void;
  @ViewChild('snav', { static: false }) snav: MatSidenav
  @ViewChild(SidebarComponent, {static: false}) sidebar: SidebarComponent
  public opened: boolean = false
  public headerTitle: string = ''
  public canShowSideNav: boolean = false
  public uid: string = ""
  public showHeader: boolean = true
  public showPush: boolean = false
  public s_b: boolean = false
  public s_d: boolean = false
  public showCard: boolean = false
  
  paddingCss: string = "padding-content"
  navigationEnded = new Subject<boolean>();
    constructor(public deviceService: DeviceDetectorService, private langService: LangService, public translate: TranslateService,  media: MediaMatcher, private router: Router, private layoutService: LayoutService, private auth: AuthService, private messagingService: MessagingService, private seo: SeoService, private storageService: LocalStorageService, private resizeService: ResizeService) { 
      this.langService.language.subscribe(lang=>{
        this.currentLang = lang
        this.translate.use(lang)
        /*  this.changeDetectorRef.detectChanges() */
      })
      
      this.resizeService.resizeSubject.subscribe(size=>{
        //console.log(size)
        setTimeout(() => {
          if(size===0){
            this.isMobile = true
          this.isTablet = false
          this.isDesktop = false
          if(this.sidebar!==undefined && this.sidebar!==null){
            this.sidebar.sidebarSubject.next('1')
          }else{
            this.toggleSideNav(false)

          }
          }else if(size===1){
            this.isMobile = true
            this.isTablet = false
            this.isDesktop = false
            if(this.sidebar!==undefined && this.sidebar!==null){
              this.sidebar.sidebarSubject.next('1')
            }else{
              this.toggleSideNav(false)
  
            }
        
          }else if(size===2){
            this.isMobile = false
            this.isTablet = true
            this.isDesktop = false
            if(this.sidebar!==undefined && this.sidebar!==null){
              this.sidebar.sidebarSubject.next('1')
            }else{
              this.toggleSideNav(false)
  
            }
          }else if(size===3){
            this.isMobile = false
            this.isTablet = false
            this.isDesktop = true
            if(this.sidebar!==undefined && this.sidebar!==null){
              this.sidebar.sidebarSubject.next('1')
            }else{
              this.toggleSideNav(true)
  
            }
          }else if(size===4){
            this.isMobile = false
            this.isTablet = false
            this.isDesktop = true
            if(this.sidebar!==undefined && this.sidebar!==null){
              this.sidebar.sidebarSubject.next('1')
            }else{
              this.toggleSideNav(true)
  
            }
          }else{
            this.isMobile = false
            this.isTablet = false
            this.isDesktop = true
            if(this.sidebar!==undefined && this.sidebar!==null){
              this.sidebar.sidebarSubject.next('1')
            }else{
              this.toggleSideNav(true)
  
            }
          }
          //this.showSideNavText = true
        }, 300);
        
      })
      // try{
      //   this.isMobile = this.deviceService.isMobile();
      //   this.isTablet = this.deviceService.isTablet();
      //   this.isDesktop = this.deviceService.isDesktop();

      // }catch(e){
      //   ////console.log(e)
      // }
     
    //   if(this.deviceService.browser.toLowerCase()!=='safari'){
    //   this.mobileQuery = media.matchMedia('(max-width: 600px)');
    
    //   this._mobileQueryListener = () => {
    //   this.isMobile = this.deviceService.isMobile();
    //   this.isTablet = this.deviceService.isTablet();
    //   this.isDesktop = this.deviceService.isDesktop();
    //   this.toggleSideNav(true)
    // }
    //   this.mobileQuery.addEventListener("change",this._mobileQueryListener);

    // }else{
    //   this.toggleSideNav(true)
    // }
      
       this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          ////////////console.log('start')
          break;
        }

        case event instanceof NavigationEnd: {
          
       
          if (window.location.pathname === '/campaigns/new/select') {
            this.headerTitle = 'new_advertise_cmp_label'
           this.hideSidenav()
            this.parentContainerPadding = false
             this.canShowSideNav = false
            this.showHeader = false
            this.showPush = false
            this.s_b = true
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Type de campagne', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });

          
    } else if(window.location.pathname==='/campaigns/new/display/create') {
            this.headerTitle = 'new_dsp_cmp_label'
            this.opened = false
            this.parentContainerPadding = true
            this.hideSidenav()
            this.canShowSideNav = false
            this.showHeader = true
            this.showPush = false
            this.s_b = true
            this.s_d = false
             this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Nouvelle campagne display', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
          }else if(window.location.pathname==='/campaigns/new/native/create') {
            this.headerTitle = 'new_rsdp_cmp'
            this.opened = false
            this.parentContainerPadding = true
            this.hideSidenav()
            this.canShowSideNav = false
            this.showHeader = true
            this.showPush = false
            this.s_b = true
            this.s_d = false
             this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Nouvelle campagne youtube', // Title Suffix
      description: 'Campagnes google adwords youtube', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
          }else if(window.location.pathname==='/campaigns/new/search/create') {
            this.headerTitle = 'new_search_cmp_label'
            this.opened = false
            this.parentContainerPadding = true
            this.hideSidenav()
            this.canShowSideNav = false
            this.showHeader = true
            this.showPush = false
            this.s_b = true
            this.s_d = false
             this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Nouvelle campagne reseau de recherche', // Title Suffix
      description: 'Campagnes google adwords youtube', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
          } else if (window.location.pathname==='/campaigns/list') {
            this.headerTitle = 'all_campaigns_main_label'
            this.parentContainerPadding = true
            this.canShowSideNav = true
                      setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showPush = true
            this.showHeader = true
            this.s_b = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Toutes les campagnes', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if (window.location.pathname==='/accounts/list') {
            this.headerTitle = 'all_accounts_label'
            this.parentContainerPadding = true
            this.canShowSideNav = true
                      setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = true
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Tous les comptes', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/campaigns/review/display') {
            this.headerTitle = 'cmp_summary_main'

            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Récapitulatif campagne', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/campaigns/review/native') {
            this.headerTitle = 'cmp_summary_main'

            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Récapitulatif campagne', // Title Suffix
      description: 'Campagnes google adwords youtube', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/campaigns/review/search') {
            this.headerTitle = 'cmp_summary_main'

            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Récapitulatif campagne', // Title Suffix
      description: 'Campagnes google adwords youtube', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/campaigns/settings/display') {
            this.headerTitle = 'cmp_settings_main'

            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Paramètre campagne', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/campaigns/settings/native') {
            this.headerTitle = 'cmp_settings_main'

            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Paramètre campagne', // Title Suffix
      description: 'Campagnes google adwords youtube', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/campaigns/settings/search') {
            this.headerTitle = 'cmp_settings_main'

            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Paramètre campagne', // Title Suffix
      description: 'Campagnes google adwords youtube', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/accounts/addFunds') {
            this.headerTitle = 'add_funds_label_main'
    
            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = false
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Ajouter des fonds', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal, pub par orange money, publicité payable par orange money, publicité par orange money, dsp,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/accounts/profile') {
            this.headerTitle = 'user_main_label'
        
            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = true
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Profile utilisateur', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/accounts/transactions') {
            this.headerTitle = 'transactions_label_main'
            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = true
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Type de campagne', // Title Suffix
      description: 'Toutes les transactions', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/overview') {
            this.headerTitle = 'overview'
            this.parentContainerPadding = true
             this.canShowSideNav = true
                       setTimeout(() => {
            if(this.deviceService.isMobile() ||this.deviceService.isTablet()){
              if(this.snav.opened){
                this.opened = false
                this.snav.close()
              }
            }else{
              this.toggleSideNav(true)
            }
            
          }, 200);
            this.showHeader = true
            this.showPush = true
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: "- Vue d'ensemble", // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if(window.location.pathname==='/auth/login' || window.location.pathname==='/auth/signup' || window.location.pathname==='/auth/action') {
            this.headerTitle = ""
            this.opened = false
            this.parentContainerPadding = false
            this.hideSidenav()
            this.canShowSideNav = false
            this.showHeader = false
            this.showPush = false
            this.showSideNavText = false
            this.s_b = false
             this.s_d = false
             this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Connexion', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
             });
            
          }else if(window.location.pathname==='/select/account') {
            this.headerTitle = 'select_adv_act_main'
            this.opened = false
            this.parentContainerPadding = true
            this.hideSidenav()
            this.canShowSideNav = false
            this.showHeader = false
            this.showPush = false
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Sélectionner un compte publicitaire', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            
          }else if(window.location.pathname==='/accounts/setup') {
            this.headerTitle = "Complétez votre inscription"
            this.opened = false
            this.parentContainerPadding = true
            this.hideSidenav()
            this.canShowSideNav = false
            this.showHeader = false
            this.showPush = false
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Paramètre du compte publicitaire', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
    });
          } else if (window.location.pathname==='/ads/list') {
            this.headerTitle = 'all_ads_main'
            this.parentContainerPadding = true
            this.canShowSideNav = true
            if (Browser.isAndroid || Browser.isIos || Browser.isIos7) {
              this.opened = false
               
            } else {
              this.opened=true
            }
            this.showPush = true
            this.showHeader = true
            this.s_b = false
            this.s_d = true
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Toutes les annonces', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if (window.location.pathname==='/ads/build') {
            this.headerTitle = 'resize_main'
            this.parentContainerPadding = true
            this.canShowSideNav = true
            if (Browser.isAndroid || Browser.isIos || Browser.isIos7) {
              this.opened = false
               
            } else {
              this.opened=true
            }
            this.showPush = false
            this.showHeader = true
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Redimensionner des images', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }else if (window.location.pathname==='/ads/create') {
            this.headerTitle = 'new_ad_label_main'
            this.parentContainerPadding = true
            this.canShowSideNav = true
            if (Browser.isAndroid || Browser.isIos || Browser.isIos7) {
              this.opened = false
               
            } else {
              this.opened=true
            }
            this.showPush = false
            this.showHeader = true
            this.s_b = false
            this.s_d = false
            this.seo.setTags({
      title: 'Adafri', // Title
      titleSuffix: '- Nouvelle annonce', // Title Suffix
      description: 'Campagnes google adwords', // Description
      image: '', // Image
      keywords: 'adafri campagne, campagne adafri, campagne publicitaire sénégal, plateforme de publicité, orange money, publicité orange money, publicité mobile money, publicité sénégal,' // Keywords
            });
            setTimeout(() => {
              this.layoutService.appDrawer = this.snav;
              this.sidebar.navigationChanged.next(true)
            }, 500);
          }

          
        
            

          break;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          this.navigationEnded.next(true)
          break;
        }
        default: {
          break;
        }
      }
    });
      
  }
     ngOnDestroy(): void {
       if(this.mobileQuery!==undefined && this.mobileQuery!==null){
         this.mobileQuery.removeListener(this._mobileQueryListener);

       }
  }

  tokens: any = []

  ngOnInit(): void {
    this.auth.getUserCredential().then(credentials => {
      if (credentials !== null) {
        ////////////console.log(credentials.token)
        //////////console.log(typeof (this.tokens))
        if (typeof (this.tokens) !== typeof (credentials.token)) {
          this.tokens.push(credentials.token)
        } else {
          this.tokens=credentials.token
        }
        this.uid = credentials.uid
        if (!credentials.authorizedPush) {
          this.showPushRequest = true
        }
        
      }
    })
    this.checkBodyStyle()
  }
   showSideNavText: boolean = true;
   isMobile: boolean = false;
   isTablet: boolean = false;
   isDesktop: boolean = false;
   togglePadding: boolean = undefined
   toggleSideNav(arg: boolean) {
     ////console.log(arg)
     setTimeout(() => {
       if(window.location.pathname!=='/auth/login' && window.location.pathname!=='/select/account' && window.location.pathname!=='/campaigns/new/select'){
        this.triggerSideNav(arg)
       }else{
        this.hideSidenav()
       }
       
     }, 300);

     
    //  this.changeDetectorRef.detectChanges()
   }
   @ViewChild(SizeDetectorComponent, {static: false}) sizeDetector: SizeDetectorComponent
   triggerSideNav(arg: boolean){
    //console.log(this.deviceService.isMobile())
    // this.isMobile = this.deviceService.isMobile();
    // this.isTablet = this.deviceService.isTablet();
    // this.isDesktop = this.deviceService.isDesktop();
    // console.log(this.isMobile)
    // console.log(this.isTablet)
    // console.log(this.isDesktop)
    
    if(this.isMobile){
      if(this.snav!==undefined){
        ////console.log(this.snav)
        //this.snav.mode = 'over'
        if (this.snav.opened) {
          
          this.snav.close()
          this.paddingCss = "no-padding"
          this.togglePadding = false  
          this.opened = false
          this.showSideNavText = false
         } else {
           this.showSideNavText = true
           this.snav.open()
           this.opened = true
          this.paddingCss = "no-padding"
          this.togglePadding = false
         
          
     }

      }else{
        // this.showSideNavText = false
        //   this.paddingCss = ""
        //   this.opened = false
      }
     }else if(this.isTablet){
       if(this.snav!==undefined){
         ////console.log(this.snav)
         //this.snav.mode = 'over'
         if (this.snav.opened) {
           
          this.snav.close()
          this.paddingCss = "no-padding"
          this.togglePadding = false
         
          this.opened = false
          this.showSideNavText = false
         } else {
           this.showSideNavText = true
           this.snav.open()
           this.opened = true
          this.paddingCss = "no-padding"
          this.togglePadding = false
         
          
     }

      }else{
        // this.showSideNavText = false
        //   this.paddingCss = ""
        //   this.opened = false
      }

    }else if(this.isDesktop){
      ////console.log(this.isDesktop)
      this.opened = true
      if(this.snav!==undefined){
        this.snav.mode = 'side'
        this.snav.open()

      }
      
      if(arg){
        this.togglePadding = true
        this.showSideNavText = true        
        this.paddingCss = "padding-content"
      }else{
       this.paddingCss = "no-padding"
       this.togglePadding = false
       setTimeout(() => {      
        this.showSideNavText = false
      }, 500);

      }
      
    }
   }
   hideSidenav(){
    this.canShowSideNav = false
         
    if(this.isMobile){
      if(this.snav!==undefined){
        ////console.log(this.snav)            
          this.snav.close()
          this.paddingCss = "no-padding"
          this.togglePadding = undefined 
          this.opened = false
          this.showSideNavText = false
      }else{
        this.showSideNavText = false
          this.paddingCss = ""
          this.opened = false
      }
     }else if(this.isTablet){
      if(this.snav!==undefined){


          this.snav.close()
          this.paddingCss = "no-padding"
          this.togglePadding = undefined
         
          this.opened = false
          this.showSideNavText = false
         
      }else{
        this.showSideNavText = false
          this.paddingCss = ""
          this.opened = false
      }

    }else if(this.isDesktop){
      this.paddingCss = "no-padding"
      this.togglePadding = undefined
     
      this.showSideNavText = false
      this.opened = true
    

      
    }
   }
   loaderColor: string = 'accent'
   defaultTheme: boolean = true
   lightTheme: boolean =  false
   currentLang: string = DEFAULT_LANG
   themeSelected(theme: string){
    if(theme!==undefined && theme!==null && (theme==='default' || theme==='light')){
      if(theme==='default'){
        this.loaderColor = 'accent'
        this.defaultTheme = true
        this.lightTheme = false
      }else if(theme==='light'){
        //////console.log('isLightTheme')
        this.loaderColor = 'primary'
        this.defaultTheme = false
        this.lightTheme = true
      }else{
        this.loaderColor = 'accent'
        this.defaultTheme = true
        this.lightTheme = false
      }
    }else{
      this.loaderColor = 'accent'
      this.defaultTheme = true
      this.lightTheme = false
    }
    // this.changeDetectorRef.detectChanges()
   }

   /* langSelected(lang: string){
    this.currentLang = lang
    this.translate.use(lang)
    this.changeDetectorRef.detectChanges()
   } */

checkBodyStyle(){
  this.storageService.getTheme().then(theme=>{
    //////console.log(theme)
    if(theme!==undefined && theme!==null && (theme==='default' || theme==='light')){
      if(theme==='default'){
        this.loaderColor = 'accent'
        this.defaultTheme = true
        this.lightTheme = false
      }else if(theme==='light'){
        //////console.log('isLightTheme')
        this.loaderColor = 'primary'
        this.defaultTheme = false
        this.lightTheme = true
      }else{
        this.loaderColor = 'accent'
        this.defaultTheme = true
        this.lightTheme = false
      }
    }else{
      this.loaderColor = 'accent'
      this.defaultTheme = true
      this.lightTheme = false
    }
  }).catch((e)=>{
    this.loaderColor = 'accent'
    this.defaultTheme = true
    this.lightTheme = false
  })
  // this.changeDetectorRef.detectChanges()
  
}
 openSideNav() {
  if(this.mobileQuery.matches){
if (this.snav.opened) {
         this.snav.close()
         this.opened = false
    } else {
         this.snav.open()
         this.opened = true
    }
    this.showSideNavText = true
  }else{
    if (this.snav.opened) {
      this.snav.close()
      this.opened = false
 } else {
      this.snav.open()
      this.opened = true
 }
  }
       
    // this.changeDetectorRef.detectChanges()
 }
  showPushRequest: boolean = false



  authorized() {
    this.messagingService.requestPermission(this.uid, this.tokens)
  }

  notAuthorized() {
    this.auth.updateUser(this.uid, {authorizedPush: false, token: 'not-authorized'})
  }



  ngAfterViewInit(): void {
    // this.toggleSideNav(true)
    // window.onresize = ()=>{
    
    // this.toggleSideNav(true)
    // }
     setTimeout(() => {
       this.myFunction()
       
     }, 500);
// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll positio
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
      /* this.changeDetectorRef.detectChanges() */
  }
  myFunction() {
    $("#sidenav-content").on('scroll',()=>{
      let scroll = $('#sidenav-content').scrollTop();
      var header = document.getElementsByTagName("body")[0];
      if(scroll>=40){
        header.classList.add("header-fixed");
      }else{
        header.classList.remove("header-fixed");
      }
    })
    
  
  // Get the header
  }
}


