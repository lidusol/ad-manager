import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User_Role, AdToDelete } from 'src/app/utils/data';
import { LocalStorageService } from '../../services/local-storage.service';
import { Ads, Display } from 'src/app/campaigns-management/models/display.models';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { YoutubeService } from 'src/app/campaigns-management/services/youtube.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { CampaignNameFromAdGroupId } from '../../pipes/date-ago.pipe';
import { Observable } from 'rxjs';
import { SERVER } from 'src/environments/environment';
import { QueryCellInfoEventArgs, PageSettingsModel, RowSelectEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { Tooltip, PositionDataModel } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { MatSelectionListChange } from '@angular/material/list';
import { take } from 'rxjs/operators';
import  _ from 'lodash';



@Component({
  selector: 'adf-list-all-display-ads',
  templateUrl: './list-all-display-ads.component.html',
  styleUrls: ['./list-all-display-ads.component.scss']
})
export class ListAllDisplayAdsComponent implements OnInit {
  aacid: string = ""
  adf_account_id: string = ""
  uid: string = ""
  uid_action: string= ""
  user_access: User_Role;
  campaigns: Display[] = []
  defaulClientCustomerId: number = SERVER.CLIENT_CUSTOMER_ID
  DP: DisplayService;
   @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent;
  @ViewChild(SnackbarComponent, { static: false }) appSnackbar: SnackbarComponent;
  @ViewChild('createAdDialog', { static: false }) createAdDialog: DialogComponent 
  public visible: Boolean = false;
  public isModal: Boolean = true
  public target: HTMLElement = document.getElementById('body');
  public position: PositionDataModel = { X: 'center', Y: 'center' };
  btnContinueDisabled: boolean = true
  public initialPage: PageSettingsModel = { pageSize: 10 };
  constructor(private storageService: LocalStorageService, private route: ActivatedRoute, private router: Router, public displayService: DisplayService, private campaignPipe: CampaignNameFromAdGroupId, private youtubeService: YoutubeService) { }
  cmp: Display[] = []
   observable: Observable<Display[]>

  getNamePipe(ad_group_id: number, uid: string) {
    return this.displayService.getCampaignWithAdGroupId(ad_group_id, uid).toPromise().then(campaign => {
      return campaign[0].name
    })
    
   
  }
  get GetCmpData() {
   return 
 }
  ngOnInit(): void {
   
  }
triggerDeletion() {
    this.confirmDeleteDialog.show()
  }

  confirmDelete() {
    
      let new_image_deleted = _.differenceBy(this.ads, this.adsPublishedToDelete, 'ad_id')
      //console.log(new_image_deleted)
      let remove: Ads[] = []
      if (new_image_deleted.length === 0) {
        remove = this.ads
      } else {
        remove = new_image_deleted
      }
      //console.log(remove)
      this.confirmDeleteDialog.hide()
      //this.loaderEdit = true

        //this.spinner.message = "Suppression en cours..."
        this.displayService.removeAd(this.adsPublishedToDelete).then(res_remove => {
          //console.log(res_remove)
          if (res_remove === "ok") {
            //this.spinner.message = "Visuel supprimé avec succés"
            //this.loaderEdit = false
            this.confirmDeleteDialog.hide()
            this.displayService.getListAds(this.uid_action, this.aacid).pipe(take(1)).subscribe(ads => {
              this.ads = ads
              this.gridAds.refresh()
            })
            //this.openSnackBar(15, 'Suppression éffectuée avec succés', 'ok', 'snack-success')
            
         
          } else {
            //this.loaderEdit = false
            //this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
          }

        }).catch((e) => {
          //this.loaderEdit = false
          //this.openSnackBar(15, 'Une erreur est survenue', 'fermer', 'snack-warn')
        });
    
    //this.deleteListAd(this.adsPublishedToDelete)
    
  
   
  
  }
  adsPublishedToDelete: AdToDelete[] = []
  @ViewChild('confirmDeleteDialog', { static: false }) confirmDeleteDialog: DialogComponent;
  @ViewChild('gridAds', { static: false }) gridAds: GridComponent;
  rowSelected(args: RowSelectEventArgs) {
      const selectedrecords: Object[] =  this.gridAds.getSelectedRecords()
      this.adsPublishedToDelete = Object.entries(selectedrecords).map(([type, value]) => {
        return ({
        id: value['id'],
        ad_id: value['ad_id'],
        ad_group_id: value['ad_group_id']

      })});
    
        
    }
   tooltip(args: QueryCellInfoEventArgs) {
        const tooltip: Tooltip = new Tooltip({
            content: args.data[args.column.field].toString()
        }, args.cell as HTMLTableCellElement);
    }
  ads: Ads[] = []
  user_role: User_Role = undefined

  deleteListAd(ads: AdToDelete[]) {
    ads.forEach((ad, index, arr) => {
      this.displayService.deleteAd(ad.id).then(deleted => {
      if (deleted === 'ok') {
        if (index === ads.length - 1) {
          alert('annonces supprimées avec succès')
          this.gridAds.refresh()
         } 
      } else {
        
        }
    }).catch(e => {
        
      })
    })
  }
  deleteAd(id: string, ad_id: number, ad_group_id: number) {
    this.displayService.deleteAd(id).then(deleted => {
      if (deleted === 'ok') {
          
      } else {
        
        }
    }).catch(e => {
        
      })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
		  this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.subscribe(params => {
				   const adf_account_id: string = params['aacid'];
					  const uid = params['auid'];
					 
					  if (response.aacid === adf_account_id && uid === response.auid && adf_account_id!==undefined && uid!==undefined) {
						  this.aacid = adf_account_id
              this.user_access = response.role
              this.uid = response.auid
              this.uid_action = response.account.owner
              if (response.fromOwned) {
                this.displayService.getListAds(this.uid_action, this.aacid).pipe(take(1)).subscribe(ads => {
                  this.ads = ads
                   this.displayService.getListCampaign(this.uid_action, this.aacid).pipe(take(1)).subscribe(campaignsDisplay => {
                     this.youtubeService.getListCampaign(this.uid_action, this.aacid).pipe(take(1)).subscribe(campaignsYoutube => { 
                       this.campaigns = [...campaignsDisplay.filter(campaign=>campaign.id_campagne!==0), ...campaignsYoutube.filter(campaign=>campaign.id_campagne!==0)]

                     })
        })
                })
                
              } else {
                this.uid_action = response.account.owner
                this.displayService.getListAds(response.account.owner, this.aacid).pipe(take(1)).subscribe(ads => {
                  this.ads = ads
                  this.displayService.getListCampaign(this.uid_action, this.aacid).pipe(take(1)).subscribe(campaignsDisplay => {
                     this.youtubeService.getListCampaign(this.uid_action, this.aacid).pipe(take(1)).subscribe(campaignsYoutube => { 
                      this.campaigns = [...campaignsDisplay.filter(campaign=>campaign.id_campagne!==0), ...campaignsYoutube.filter(campaign=>campaign.id_campagne!==0)]
                     })
    
         
        })
                })
              }
						 
					  } else {
						  this.router.navigate(['/ads/list'], { queryParams: { aacid: response.aacid, auid: response.auid } })
					  }
			 
				 })
				
			}
		})
   
    }, 500);
  }

  loaderEdit: boolean = false
    changeAdStatus(id: string, ad_id: string, status: string, ad_group_id: number) {
    this.loaderEdit = true
    setTimeout(() => {
      this.spinner.message = "Traiement en cours..."
      this.displayService.changeAdStatus(id, ad_group_id, ad_id, status).then(res_status => {
        if (res_status === "ok") {
          this.spinner.message = "Status mis é jour avec succés !"
          this.loaderEdit = false
        
        } else {
          this.loaderEdit = false
      }
      }).catch((e) => {
      this.loaderEdit = false
    })
     
    }, 500);
    
    
  }

  selectedCampaign: Display = null
  onCampaignSelect(args: MatSelectionListChange) {
    console.log(args.option.value)
    this.selectedCampaign = args.option.value
    
  }

  goCreateAd() {
    this.createAdDialog.hide()
    this.router.navigate(['/ads/create'], {queryParams: {type: this.selectedCampaign.type, auid: this.uid, aacid: this.aacid, name: this.selectedCampaign.name, fidc: this.selectedCampaign.id, aidc: this.selectedCampaign.id_campagne, agidf: this.selectedCampaign.ad_group_id_firebase, agid: this.selectedCampaign.ad_group_id}})
   /*  if (this.selectedCampaign.id_campagne === 0) {
      
    } else {
      this.router.navigate(['/ads/create'], {queryParams: {auid: this.uid, aacid: this.aacid, fidc: this.selectedCampaign.id, aidc: this.selectedCampaign.id_campagne}})
    } */
  }

}
