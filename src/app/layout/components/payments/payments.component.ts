import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CURRENCY } from 'src/environments/environment';
import { ToolbarItems, ContextMenuItem, GridLine, SelectionSettingsModel, CommandModel } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PublishCampaignComponent } from '../publish-campaign/publish-campaign.component';
import { AuthService } from 'src/app/auth/auth.service';
import { PaymentService } from '../../services/payment.service';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { NotificationsService } from '../../services/notifications.service';
declare var $: any; 




 
declare const printJS: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, AfterViewInit {
  @ViewChild('dialogShowInvoice', { static: false }) dialogShowInvoice: DialogComponent
  public visible: Boolean = false;
  @ViewChild('container', { static: true }) container: ElementRef;
    @ViewChild(PublishCampaignComponent, { static: false }) publishCampaignComponent: PublishCampaignComponent;
    // The Dialog shows within the target element.
    public targetElement: HTMLElement;
 public uid: string = ""
  public accountValue: number = 0
  public email: string = ""
  public first_name: string = ""
  public last_name: string = ""
  public telephone: string = ""
  public adresse: string = ""
  public noTransactions: boolean = true
    public toolbarOptions: ToolbarItems[];
  public contextMenuItems: ContextMenuItem[];
  public gridLines: GridLine;
  public selectionOptions: SelectionSettingsModel;
  public dataTransactions: any;
  public commands: CommandModel[];
  public invoiceValue: number = 0
  public invoiceData: any = [];
  public dueDate: any = []
  public publishComponent: boolean = false
  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router, private paymentService: PaymentService, private snackBar: MatSnackBar, private notificationsService: NotificationsService, public displayService: DisplayService) { }

  openInvoice(value, data) {
    var today = new Date()
    this.dueDate = [('0' + (today.getDate())).slice(-2), ('0' + (today.getMonth() + 1)).slice(-2), today.getFullYear()].join('/');
    this.paymentService.getSingleTransaction(data.uid, data.key).subscribe(result => {
      if (result.length > 0) {
        this.invoiceData = result
         this.invoiceValue = value
   
    console.log(this.invoiceData)
    this.dialogShowInvoice.show()
      }
    })
   
  }
  hideInvoice() {
     this.dialogShowInvoice.hide()
  }
  print() {
     Popup($('.invoice')[0].outerHTML);
            function Popup(data) 
            {
                window.print();
                return true;
            }
  /*   printJS({printable: 'print-section', type: 'html', css: 'assets/images/custom-ejs.css'}) */
  }

 

  ngOnInit() {
    this.getUserCredentials().then(get_cred => {
      if (get_cred === "ok") {
        this.gridLines = 'Both';
        this.selectionOptions = { type: 'Multiple' };
         this.commands = [{ type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } }];
        /* this.loadScript() */
      }
    })
     
    
    
    
   /*  this.toolbarOptions = ['Search', 'ColumnChooser']; */
    /* this.contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
            'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage',
      'LastPage', 'NextPage']; */
   
  }
   getUserCredentials():Promise<string> {
    return new Promise(resolve => {
        this.auth.user.subscribe(child => {
          if (child !== null) {
            this.uid = child.uid
            this.accountValue = child.account_value
            this.email = child.email
            this.first_name = child.first_name
            this.last_name = child.last_name
            this.adresse = child.addresse
            this.telephone = child.telephone
            
            resolve('ok')
            
          }
        })
      })
   }
     getCurrentUserCredentials(): Promise<any>{
    return new Promise(resolve => {
      var response = []
  
       this.auth.user.forEach(data => {
        response.push({
          "uid": data.uid,
          "email": data.email,
          "account_value": data.account_value,
          "paymentKey": data.paymentKey,
          "first_name": data.first_name,
          "last_name": data.last_name,
          "addresse": data.addresse,
          "telephone": data.telephone
        })
  
          
          resolve(response)
          
        })
    })
  } 
  ngAfterViewInit() {
    /* setTimeout(() => {
      this.loadScript()
    },1000) */
   /*  this.getRoute().then(res_route => {
      if (res_route === "ok") {
        this.getUserCredentials().then(res_cred => {
          if (res_cred === "ok") {
            
            this.paymentService.getListTransaction(this.uid).subscribe(data => {
    
              if (data.length > 0) {
                 this.dataTransactions = data
             
          
              this.noTransactions = false
            }
        })
          }
        })
      }
    }) */
   
    
  }

  createNotification(uid: string,  type: string, content: string, campaign_id, campaign_name): Promise<string>{
    return new Promise(resolve => {
      this.notificationsService.createNotification(uid, type, content, campaign_id, campaign_name)
      resolve('ok')
    })
  }
  /* getRoute(): Promise<any>{
    return new Promise(resolve => {

      this.route.params.subscribe(params => {
         if (params['key'] !== undefined) {
           this.getCurrentUserCredentials().then(credentials => {
             var paymentKey = credentials[0]['paymentKey']
            this.uid = credentials[0]['uid']
             this.accountValue = credentials[0]['account_value']
             this.email = credentials[0]['email']
             this.first_name = credentials[0]['first_name']
             this.last_name = credentials[0]['last_name']
             this.adresse = credentials[0]['addresse']
             this.telephone = credentials[0]['telephone'] 
             if (paymentKey.toString() === params['key'].toString()) {            
            var montant = localStorage.getItem(paymentKey)
            if (montant === null) {
                this.router.navigate(['/dashboard/payments'])
            } else {
              var new_value = 0
              new_value = parseInt(montant)/CURRENCY.DOLLAR + this.accountValue
              this.paymentService.createTransaction(this.uid, "Rechargement", parseInt(montant)/CURRENCY.DOLLAR, params['key'], 0, "", ).then(paymentStatus => {
                if (paymentStatus === "ok") {
                  this.auth.updateUser(this.uid, { account_value: new_value, paymentKey: "" }).then(res => {
                  if (res != "error") {
             
                        localStorage.removeItem(paymentKey)
                        this.notificationsService.createNotification(this.uid, "Rechargement", "Le solde de votre compte a été mis à jour avec succès !", 0, "").then(notification_response => {
                          if (notification_response === "ok") {
                            var campaign_save = localStorage.getItem('wait_pay')
                            if (campaign_save) {
                              var campaign = JSON.parse(campaign_save)[0]
                              if (campaign['type'] === "1") {
                                this.displayService.getSingleCampaignData(campaign['id']).then((data) => {
                                      
                                  if (this.accountValue >= data['budget']) {
                                    this.publishComponent = true
              setTimeout(() => {
                        this.publishCampaignComponent.email = this.email
                this.publishCampaignComponent.uid = this.uid
                this.publishCampaignComponent.text_init = "Procéder à la publication de la campagne "+ data['name']
                this.publishCampaignComponent.account_value = this.accountValue
                   this.publishCampaignComponent.injectedData = data
                this.publishCampaignComponent.onOpenDialog()
       localStorage.removeItem('wait_pay')
              }, 500)
                                    
                                  } else {
                                    alert("Vous n'avez pas assez de fonds pour publier la campagne "+ data['name'] +" avec un budget de "+data['budget'])
                                     window.location.replace('/dashboard/payments')
                                  }
                                 })
                                
                              } else if(campaign['type'] === "2") {
                             
                              }
                            } else {
                              window.location.replace('/dashboard/payments')
                              
                            }
                            
                          }
                        })
                        
                   
                  }
                  })
                  
                }
              })
          
              }
          } else {
            this.router.navigate(['/'])
          }
        }) 
  
         } else {
           resolve("ok")
           
      }
      })
      
    })
  
  } */

  getNotificationId(uid: string): Promise<string>{
    return new Promise(resolve => {
      this.auth.getNotificationData(uid).forEach(data => {
        resolve(data[0]['id'])
      })
    })
  }


    openSnackBar(message: string, action: string) {
/*     this.snackBar.openFromComponent(ImageCreateComponent) */
    this.snackBar.open(message, action, {
      duration: 105000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'

    });
  }
}
