import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { Router } from '@angular/router'
import { MatPaginator } from '@angular/material/paginator'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'

import { Campaign, Adset, Ad } from 'src/app/campaigns-management/models/facebook.models'
import { FacebookService } from 'src/app/campaigns-management/services/facebook.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'adf-fb-campaigns',
  templateUrl: './fb-campaigns.component.html',
  styleUrls: ['./fb-campaigns.component.scss']
})
export class FbCampaignsComponent implements OnInit {
  @ViewChild(MatTable) campaignTable: MatTable<Campaign>  
  @ViewChild(MatTable) adsetTable: MatTable<Adset>

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>()

  campaignDataSource: any = []
  adsetDataSource: any = []
  adDataSouce: any = []

  displayedCampaignColumns: string[] = ['select', 'name', 'objective', 'status'] 
  displayedAdsetColumns: string[] = ['select', 'name', 'budget', 'start_date']
  campaignSelection = new SelectionModel<Campaign>(true, [])
  adsetSelection = new SelectionModel<Adset>(true, [])

  isLoading: boolean = false

  constructor(private router: Router, private facebookService: FacebookService,  private dialog: MatDialog) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.displayCampains()
    this.displayAdsets()
  }

  isAllSelected(selection, dataSource) {
    const numSelected = selection.selected.length
    const numRows = dataSource.data.length
    return numSelected === numRows
  }

  masterToggle(selection, dataSource) {
    this.isAllSelected(selection, dataSource) ?
    selection.clear() :
    dataSource.data.forEach(row => selection.select(row))
  }

  getCampaigns(){
    let campaigns = []
    return new Promise<any>((resolve, reject) => {
      this.facebookService.getCampaigns().subscribe(         
        (data) => {
          data.docs.forEach(element => {
              campaigns.push({
                select: false,
                ...element
              })
            })
          resolve(campaigns)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  async displayCampains() {
    let campaigns = await this.getCampaigns().then(data => data.reverse())
    this.campaignDataSource = new MatTableDataSource<Campaign>(campaigns)
    this.campaignDataSource.paginator = this.paginator.toArray()[0]
  }

  getAdsets(){
    let adsets = []
    return new Promise<any>((resolve, reject) => {
      this.facebookService.getAdsets().subscribe(
        (data) => {
          data.docs.forEach(element => {
            adsets.push({
                select: false,
                ...element
            })
          })
          resolve(adsets)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  async displayAdsets(){
    let adsets = await this.getAdsets().then(data => data.reverse())
    this.adsetDataSource = new MatTableDataSource<Adset>(adsets.reverse())
    this.adsetDataSource.paginator = this.paginator.toArray()[1]
  }

  goSelectCampaign(){
     this.router.navigate(['campaigns/new/select-fb'])
  }

  deleteCampaign(){
    let selectedCampaigns = this.campaignSelection.selected
    if(selectedCampaigns.length > 0){
      selectedCampaigns.forEach(async campaign => {
        this.isLoading = true
        await this.facebookService.deleteCampaign(campaign.campaign_id).subscribe(
          () => {
            let newData = this.campaignDataSource.data.filter(data => data.campaign_id !== campaign.campaign_id)
            this.campaignDataSource.data = newData
            this.campaignTable.renderRows()
            this.campaignSelection.clear()
            this.isLoading = false
          },
          (error) => {
            console.log(error)
          }
        )
      })
    }else {
      this.isLoading = false
    }
  }

  deleteAdset(){
    let selectedAdsets = this.adsetSelection.selected
    if(selectedAdsets.length > 0){
      selectedAdsets.forEach(async adset => {
        this.isLoading = true
        await this.facebookService.deleteAdset(adset.adset_id).subscribe(
          () => {
            let newData = this.adsetDataSource.data.filter(data => data.adset_id !== adset.adset_id)
            this.adsetDataSource.data = newData
            this.adsetTable.renderRows()
            this.adsetSelection.clear()
            this.isLoading = false
          },
          (error) => {
            console.log(error)
          }
        )
      })
    }else {
      this.isLoading = false
    }
  }

  openDialogDelete(data){
    const dialogRef = this.dialog.open(DialogDelete, { data })
    dialogRef.afterClosed().subscribe(result => {
      if(result === undefined){
        return
      }else if(result === 'delete'){
        switch(data){
         case 'campaign':
            this.deleteCampaign()
            break
          case 'adset':
            this.deleteAdset()
            break
          default:
            break
        }
        
      }
    })
  }

}


@Component({
  selector: 'dialog-delete',
  template: `<div>  
                <h6 mat-dialog-title>Do you want to delete the {{data}}?</h6>
                <div mat-dialog-content>
                  <p>If you delete this {{data}}, you won't be able to recover it later.</p>
                </div>
                <div mat-dialog-actions class="d-flex justify-content-end">
                  <button style="border: none;padding: 10px 30px;border-radius: 4px; margin: 5px;" (click)="onNoClick()">Cancel</button>
                  <button style="border: none;background: blue;color: #fff;padding: 10px 30px;border-radius: 4px; margin: 5px;" (click)="dialogRef.close('delete')" cdkFocusInitial>Delete</button>
                </div>
              </div>`,
})
export class DialogDelete {

  constructor(public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true
    }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }
}