import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SearchService } from 'src/app/campaigns-management/services/search.service';
import { KEYWORDS_TARGET } from 'src/app/utils/data';

@Component({
  selector: 'adf-keywords-list-preview',
  templateUrl: './keywords-list-preview.component.html',
  styleUrls: ['./keywords-list-preview.component.scss']
})
export class KeywordsListPreviewComponent implements OnInit {
  cid: string = '';
  campaignId: number = null
  ad_group_id: number = 0
  ad_group_id_firebase: string = ''
  checkboxDisabled: boolean = true
  @ViewChild(MatPaginator, {static: false}) paginatorNotPublished: MatPaginator;
  @ViewChild(MatPaginator, {static: false}) paginatorPublished: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select','keyword'];
  dataNotPublished: any = []
  dataPublished: any = []
  setDataSourceNotPublished(data: any){
    this.dataNotPublished = [...this.dataNotPublished, ...data]
    this.dataSourceNotPublished.data =  data
    setTimeout(()=>{
     
      this.dataSourceNotPublished.paginator = this.paginatorNotPublished;
        this.dataSourceNotPublished.sort = this.sort;

    },1000)
  }
  setDataSourcePublished(data: any){
    console.log(data)
    this.dataPublished = [...this.dataPublished, ...data]
    this.dataSourcePublished.data =  data
    setTimeout(()=>{
      this.dataSourcePublished.paginator = this.paginatorPublished;
      this.dataSourcePublished.sort = this.sort;

    },1000)
  }
  dataSourceNotPublished = new MatTableDataSource<any>();
  selectionNotPublished = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedNotPublished() {
    const numSelected = this.selectionNotPublished.selected.length;
    const numRows = this.dataSourceNotPublished.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleNotPublished() {
    this.isAllSelectedNotPublished() ?
        this.selectionNotPublished.clear() :
        this.dataSourceNotPublished.data.forEach(row => this.selectionNotPublished.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelNotPublished(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedNotPublished() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionNotPublished.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  dataSourcePublished = new MatTableDataSource<any>([]);
selectionPublished = new SelectionModel<any>(true, []);
/** Whether the number of selected elements matches the total number of rows. */
isAllSelectedPublished() {
  const numSelected = this.selectionPublished.selected.length;
  const numRows = this.dataSourcePublished.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterTogglePublished() {
  this.isAllSelectedPublished() ?
      this.selectionPublished.clear() :
      this.dataSourcePublished.data.forEach(row => this.selectionPublished.select(row));
}

/** The label for the checkbox on the passed row */
checkboxLabelPublished(row?: any): string {
  if (!row) {
    return `${this.isAllSelectedPublished() ? 'select' : 'deselect'} all`;
  }
  return `${this.selectionPublished.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

removeNotPublished(){
  let selected = this.selectionNotPublished.selected
  let new_data = this.dataNotPublished.filter(el=>!selected.includes(el))
  this.searchService.updateCampaign(this.cid, {keywords: new_data}).then((updated)=>{
    if(updated==='ok'){

    }else{

    }
  }).catch((e)=>{
    //console.log(e)
  })
 
}

removePublished(){
  let selected = this.selectionPublished.selected
  let new_data = this.dataPublished.filter(el=>!selected.includes(el))
  this.searchService.removeKeywords(selected, this.ad_group_id, this.ad_group_id_firebase, new_data).then((updated)=>{
    if(updated==='ok'){

    }else{
      
    }
  }).catch((e)=>{
    //console.log(e)
  })
 
}
  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    if(window.location.pathname==='/campaigns/review/search'){
      this.checkboxDisabled = true
    }else if(window.location.pathname==='/campaigns/settings/search'){
      this.checkboxDisabled = false
    } 
  }

}
