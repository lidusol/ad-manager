import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User_Role } from 'src/app/utils/data';
import { Display } from 'src/app/campaigns-management/models/display.models';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { MatSelectionListChange } from '@angular/material/list';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { MessagingService } from '../services/messaging.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';

@Component({
  selector: 'adf-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss']
})
export class SpeedDialFabComponent implements OnInit {
  @ViewChild('createAdDialog', { static: false }) createAdDialog: DialogComponent 
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;
  aacid: string = ""
  uid: string = ""
  user_access: User_Role;
  uid_action: string = ""
  chatVisible: boolean = false
  toggleChat(){
    this.chatVisible = !this.chatVisible
  }
  fabButtons = [
     {
    icon: 'home_work',
    tooltip: 'Accueil',
      action: 'home',
    color: 'accent',
  },
    {
    icon: 'campaign',
    tooltip: 'Nouvelle campagne',
      action: 'cmp',
    color: 'accent'
  },
   
    {
      icon: 'collections',
      tooltip: 'Nouvelle annonce',
      action: 'ad',
      color: 'accent'
    },
    {
      icon: 'notifications',
      tooltip: "Me notifier sur l'évolution de mes campagnes",
      action: 'notif',
      color: 'warn'
    },
    /* {
      icon: 'room'
    },
    {
      icon: 'lightbulb_outline'
    },
    {
      icon: 'lock'
    } */
  ];
  buttons = [];
  fabTogglerState = 'inactive';
  campaigns: Display[] = []
  public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  btnContinueDisabled: boolean = true
    selectedCampaign: Display = null
  onCampaignSelect(args: MatSelectionListChange) {
    console.log(args.option.value)
    this.selectedCampaign = args.option.value
    
  }

  goCreateAd() {
    this.createAdDialog.hide()
    this.router.navigate(['/ads/create'], {queryParams: {auid: this.uid, aacid: this.aacid, name: this.selectedCampaign.name, fidc: this.selectedCampaign.id, aidc: this.selectedCampaign.id_campagne, agidf: this.selectedCampaign.ad_group_id_firebase, agid: this.selectedCampaign.ad_group_id}})
   /*  if (this.selectedCampaign.id_campagne === 0) {
      
    } else {
      this.router.navigate(['/ads/create'], {queryParams: {auid: this.uid, aacid: this.aacid, fidc: this.selectedCampaign.id, aidc: this.selectedCampaign.id_campagne}})
    } */
  }
   openSnackBar(timeout: number, message: string, action: string, css: string) {
    this.appSnackbar.openSnackBar(timeout, message, action, css)
  }

  btnClicked(query: string) {
    if (query === "cmp") {
      if (this.user_access !== undefined && this.user_access.admin) {
        this.onToggleFab()
        this.router.navigate(['/campaigns/new/select'], { queryParams: { aacid: this.aacid, auid: this.uid } })
        
      } else {
        this.openSnackBar(20, "Vous n'êtes pas autorisé à créer des campagnes pour ce compte", 'ok', '')
      }
    } else if (query === "ad") {
       if (this.user_access !== undefined && this.user_access.admin) {
         this.displayService.getListCampaign(this.uid_action, this.aacid).subscribe(campaignsDisplay => {
           this.youtubeService.getListCampaign(this.uid_action, this.aacid).subscribe(campaignsYoutube => { 
           this.campaigns = [...campaignsDisplay, ...campaignsYoutube]
           this.createAdDialog.show()

           })
           })
         this.onToggleFab()
        
       } else {
         this.openSnackBar(20, "Vous n'êtes pas autorisé à créer des annonces pour ce compte", 'ok', '')
      }
    } else if (query === 'home') {
      this.onToggleFab()
      this.router.navigate(['/overview'], { queryParams: { aacid: this.aacid, auid: this.uid } })
    } else if (query === 'notif') {
      this.messagingService.requestPermission(this.uid, this.tokens)
    }
  }
 
  constructor(private storageService: LocalStorageService, private router: Router, private route: ActivatedRoute, private auth: AuthService, private displayService: DisplayService, private youtubeService: YoutubeService, private messagingService: MessagingService) {

   }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

    tokens: any = []

  getUserCred(): Promise<string>{
    return new Promise(resolve => {
    this.auth.getUserCredential().then(credentials => {
      if (credentials !== null) {
        ////console.log(credentials.token)
        //console.log(typeof (this.tokens))
        if (typeof (this.tokens) !== typeof (credentials.token)) {
          this.tokens.push(credentials.token)
          resolve('ok')
        } else {
          this.tokens = credentials.token
          resolve('ok')
        }
       
        
      }
    })
  })
}
  isLoading: boolean = true
  ngOnInit(): void {
    this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
          this.getUserCred().then(getting_cred => {
            if (getting_cred === 'ok') {
              this.aacid = response.aacid
                this.uid = response.auid
              this.user_access = response.role
              if (response.fromOwned) {
                this.uid_action = response.auid
                this.isLoading = false
              } else {
                this.uid_action = response.account.owner
                this.isLoading = false
              }
             
           }
         })
			 
				
				
			}
      })
  }

}
