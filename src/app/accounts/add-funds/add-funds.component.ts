import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  Renderer2
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SERVER, CURRENCY, DEFAULT_LANG, P_CID, P_CID_SB } from "src/environments/environment";
import { DialogComponent } from "@syncfusion/ej2-angular-popups";
import { EmitType } from "@syncfusion/ej2-base";
import { ActivatedRoute, Router } from "@angular/router";
import {
  TabComponent,
  SelectEventArgs
} from "@syncfusion/ej2-angular-navigations";
import { MatButtonToggleGroup, MatButtonToggleChange } from "@angular/material/button-toggle";
import { HttpClient } from "@angular/common/http";
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { AuthService } from 'src/app/auth/auth.service';
import { DeviceDetectorService } from "ngx-device-detector";
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { User_Role, BizaoResult, BIZAO_TOKEN_RESPONSE, BIZAO_CARD_RESPONSE, PENDING_TRANSACTION } from 'src/app/utils/data';
import { DOCUMENT } from '@angular/common';
import { AccountsService } from '../accounts.service';
import { TranslateService } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LangService } from "src/app/layout/components/lang.service";
import { PaymentService } from "src/app/layout/services/payment.service";
import { ICreateOrderRequest, IPayPalConfig } from "ngx-paypal";
declare const pQuery: any;
declare const Tingg: any;
declare const PayExpresse: any;
const SERVER_URL = SERVER.url;
declare const PayDunya: any;
@Component({
  selector: "app-add-funds",
  templateUrl: "./add-funds.component.html",
  styleUrls: ["./add-funds.component.scss"]
})
export class AddFundsComponent implements OnInit, AfterViewInit {
  public payPalConfig ? : IPayPalConfig;

  @ViewChild("ejDialog", { static: false }) ejDialog: DialogComponent;
  // The Dialog shows within the target element.
  @ViewChild("container", { static: false }) container: ElementRef;
  @ViewChild("tab", { static: false }) tab: TabComponent;


  @ViewChild("paysCheckBox", { static: false })
  paysCheckbox: CheckBoxComponent;
  @ViewChild("paymentCheckBox", { static: false })
  paymentCheckbox: CheckBoxComponent;
  @ViewChild("group", { static: false })
  buttonToggleGroup: MatButtonToggleGroup;
  // The Dialog shows within the target element.
  public targetElement: HTMLElement;
  public uid: string = "";
  public accountValue: number = 0;
  public progressBilling: boolean = false;
  public USER_TYPE = "";
  public paymentForm: FormGroup;
  public billingForm: FormGroup;
  public selectOption = false;
  public billingError = false;
  private montant: number = 0;
  public first_name: string = "";
  public last_name: string = "";
  public adresse: string = "";
  public identityEntreprise: string = "";
  public phone: string = "";
  public code_postal: string = "";
  public headerText: Object[] = [];
  public countrySelected: string = "";
  public paymentSelected: string = "";
showSuccess: boolean = false
  public tabSelected(e: SelectEventArgs): void {
    if (e.isSwiped) {
      e.cancel = true;
    }
  }


  public currentCountrySelected: string = ""
  public currentPaymentSelected: string = ""

  private initConfig(): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: P_CID_SB,
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      application_context:{
        brand_name: 'Adafri',
        locale: 'fr'
      },
    
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '1',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '1'
              }
            }
          },
          items: [
            {
              name: 'Test rechargement de compte',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: '1',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: "true",
  
    },
    style: {
      label: 'pay',
      layout: 'vertical',

    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }
  selectCountry(id: string) {
    if (id === 'SN') {
      if (this.currentCountrySelected !== id) {
        this.currentPaymentSelected = "PE"
        document.getElementById(this.currentCountrySelected).classList.remove('active', 'pulse')
        document.getElementById(id).classList.add('active', 'pulse')
        this.currentCountrySelected = id
        setTimeout(() => {
          if (!document.getElementById('PE').classList.contains('active')) {
            document.getElementById('PE').classList.add('active', 'pulse')

          }
          if (document.getElementById('PA').classList.contains('active')) {
            document.getElementById('PA').classList.remove('active', 'pulse')

          }
          if (document.getElementById('BZ').classList.contains('active')) {
            document.getElementById('BZ').classList.remove('active', 'pulse')

          }
        }, 500)

      }
    } else if (id === 'CI') {
      if (this.currentCountrySelected !== id) {
        document.getElementById(this.currentCountrySelected).classList.remove('active', 'pulse')
        document.getElementById(id).classList.add('active', 'pulse')
        this.currentCountrySelected = id
        this.currentPaymentSelected = 'BZ'
        setTimeout(() => {
          if (!document.getElementById('BZ').classList.contains('active')) {
            document.getElementById('bZ').classList.add('active', 'pulse')

          }
          if (document.getElementById('PA').classList.contains('active')) {
            document.getElementById('PA').classList.remove('active', 'pulse')

          }
          
        }, 500)

      }
    } else if (id === 'ML') {
      if (this.currentCountrySelected !== id) {
        this.currentPaymentSelected = "PE"
        document.getElementById(this.currentCountrySelected).classList.remove('active', 'pulse')
        document.getElementById(id).classList.add('active', 'pulse')
        this.currentCountrySelected = id
        setTimeout(() => {
          if (!document.getElementById('PE').classList.contains('active')) {
            document.getElementById('PE').classList.add('active', 'pulse')

          }
        }, 500)
      }
    }


  }
  cardOnly: boolean = false
  channel_pa: string = ""
  applyTaxes: boolean = false
  selectPayment(id: string, channel?: string) {
    this.channel_pa = channel
    this.cardOnly = false
    if(channel===undefined || channel===null){
      this.applyTaxes = false
    }else{
      this.applyTaxes = true
    }
    if (this.currentPaymentSelected === id) {
      return;
    } else {
      document.getElementById(id).classList.add('active', 'pulse')
      if (document.getElementById(this.currentPaymentSelected) !== undefined && document.getElementById(this.currentPaymentSelected) !== null) {
        document.getElementById(this.currentPaymentSelected).classList.remove('active', 'pulse')

      }
      this.currentPaymentSelected = id
    }

  }
  provider: string = ""
  selectPaymentMobileMoney(id: string, provider: string) {
    this.provider = provider
    if (this.currentPaymentSelected === id) {
      return;
    } else {
      document.getElementById(id).classList.add('active', 'pulse')
      if (document.getElementById(this.currentPaymentSelected) !== undefined && document.getElementById(this.currentPaymentSelected) !== null) {
        document.getElementById(this.currentPaymentSelected).classList.remove('active', 'pulse')

      }
      this.currentPaymentSelected = id
    }

  }

  selectBizaoCard(id: string, provider: string) {
    this.provider = provider
    if (this.currentPaymentSelected === id) {
      return;
    } else {
      document.getElementById(id).classList.add('active', 'pulse')
      if (document.getElementById(this.currentPaymentSelected) !== undefined && document.getElementById(this.currentPaymentSelected) !== null) {
        document.getElementById(this.currentPaymentSelected).classList.remove('active', 'pulse')

      }
      this.currentPaymentSelected = id
    }

  }

  clickCountry(id: string) {

    if (id === 'SN') {
      this.paysCheckbox.value = "Sn"
    } else {
      this.paysCheckbox.value = "Ci"
    }

  }

  clickPayment(id: string) {
    if (id === 'PE') {
      this.paysCheckbox.value = "PE"
    } else if(id==="BZ") {
      this.paysCheckbox.value = "BZ"
    }else if(id==='PA'){
      this.paysCheckbox.value = "PA"
    }
  }
  public btnClicked(e: any): void {
    switch (e.target.id) {
      case "goPayments":
        this.getBillingForm().then(res_billing => {
          if (res_billing === "ok") {
            this.tab.select(1);
          } else {
            this.tab.select(0);
          }
        });
        break;

      case "goBack":
        this.tab.select(0);
    }
  }

  getUserType(): Promise<string> {
    return new Promise(resolve => {
      if (this.USER_TYPE === "1") {
        this.selectOption = false;
        resolve("ok");
      } else if (this.USER_TYPE === "2") {
        this.selectOption = false;
        resolve("ok");
      } else {
        this.selectOption = true;
      }
    });
  }
  getBillingForm(): Promise<string> {
    return new Promise(resolve => {
      this.getUserType().then(res => {
        if (res === "ok") {
          this.progressBilling = true;
          if (this.billingForm.valid) {
            if (this.USER_TYPE === "1") {
              this.auth
                .updateUser(this.uid, {
                  first_name: this.billingForm.value["nom"],
                  last_name: this.billingForm.value["prenom"],
                  entrepriseName: this.billingForm.value["entrepriseName"],
                  addresse: this.billingForm.value["addresse"],
                  telephone: this.billingForm.value["telephone"],
                  postal: this.billingForm.value["postal"]
                })
                .then(res => {
                  if (res === "ok") {
                    this.progressBilling = false;
                    resolve("ok");
                  } else {
                    resolve("error");
                    this.progressBilling = false;
                  }
                });
            } else {
              this.auth
                .updateUser(this.uid, {
                  first_name: this.billingForm.value["nom"],
                  last_name: this.billingForm.value["prenom"],
                  entrepriseName: "",
                  addresse: this.billingForm.value["addresse"],
                  telephone: this.billingForm.value["telephone"],
                  postal: ""
                })
                .then(res => {
                  if (res === "ok") {
                    this.progressBilling = false;
                    resolve("ok");
                  } else {
                    this.progressBilling = false;
                    resolve("error");
                  }
                });
            }
            this.billingError = false;
          } else {
            this.progressBilling = false;
            this.billingError = true;
            resolve("error");
          }
        } else {
          resolve("error");
          this.progressBilling = false;
        }
      });
    });
  }

  constructor(
    private auth: AuthService,
    private _formBuilder: FormBuilder,
    public deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private storageService: LocalStorageService,
    private router: Router,
    public dialog: MatDialog,
    private _renderer2: Renderer2,
    private accountsService: AccountsService,
    @Inject(DOCUMENT) private _document: Document,
    private translate: TranslateService,
    private langService: LangService,
    private paymentService: PaymentService,
  ) { 
    this.langService.language.subscribe(lang=>{
      this.translate.use(lang);
    })
  }

  aacid: string = ""
  public user_access: User_Role = undefined

  ngOnInit() {
    this.paymentForm = this._formBuilder.group({
      amount: [
        "",
        [Validators.required, Validators.min(0.1), Validators.max(10000)]
      ]
    });
    this.billingForm = this.fb.group({
      prenom: ["", [Validators.required]],
      nom: ["", [Validators.required]],
      addresse: ["", [Validators.required]],
      telephone: ["", [Validators.required]],
      entreprise: ["", [Validators.nullValidator]],
      particulier: ["", [Validators.nullValidator]],
      entrepriseName: ["", [Validators.nullValidator]],
      postal: ["", [Validators.nullValidator]]
    });
    this.headerText = [{ text: "Informations" }, { text: "Payment" }];
  }
  loadScript() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://cdn.payexpresse.com/v1/payexpresse.min.js"
    this._renderer2.appendChild(this._document.body, script);
  }


  currentAccountValue: number = 0
  currentAccountName: string = ''
  currentAccountId: string = ''

  currentEmail: string = ""
  interval_refresh: any;
  country: string = null
  ngOnDestroy(): void {
	//Called once, before the instance is destroyed.
	//Add 'implements OnDestroy' to the class.
	if(this.interval_refresh!==undefined && this.interval_refresh!==null){
	  clearInterval(this.interval_refresh)
  
	}
  }

  getLang(){
    this.storageService.getLang().then(lang=>{
      ////console.log(lang)
      if(lang!==undefined && lang!==null && (lang==='en' || lang==='fr')){
        this.translate.use(lang);
      }else{
        this.translate.use(DEFAULT_LANG)
      }
    }).catch(e=>{
      this.translate.use(DEFAULT_LANG)
    })
    
    }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.storageService.getUserIdAndAccountId().then(response => {
        if (response !== null) {
          this.route.queryParams.subscribe(params => {
            const adf_account_id: string = params['aacid'];
            const uid = params['auid'];

            if (response.aacid === adf_account_id && uid === response.auid) {
              this.aacid = response.aacid
              this.uid = response.auid
              this.user_access = response.role
              this.currentAccountValue = response.account.account_value
              this.currentAccountName = response.account.name
              this.currentAccountId = response.account.id
              this.currentEmail = response.email
              this.auth.user.pipe(take(1)).subscribe(value=>{
                //console.log(value)
                this.first_name = value.first_name
                this.last_name = value.last_name
                this.phone = value.phoneInfo.internationalNumber
                //console.log(value.phoneInfo.countryCode)
                this.country = value.phoneInfo.countryCode
                this.currentCountrySelected = this.country
                this.paymentService.getPendingTransaction(this.uid, this.aacid).pipe(take(1)).subscribe(pending=>{
                  if(pending.length>0){
                    let pending_transaction: PENDING_TRANSACTION = pending[0]
                    this.paymentService.getPaymentStatus(pending_transaction)
                  }
                })
              })
              this.initConfig();
              this.loadScript()
   


            } else {
              this.router.navigate(['/accounts/addFunds'], { queryParams: { aacid: response.aacid, auid: response.auid } }).then(() => {
                setTimeout(() => {

                  this.loadScript()


                }, 1000);
              })
            }

          })

        }
      })

    }, 500);

    this.getLang()
/*     this.interval_refresh = setInterval(()=>{
		},500) */
  }
  hideFrame(){
setTimeout(() => {
  let el = $('iframe').contents().find('#design_topbar_left > div > a');
  console.log(el)
  

}, 2000);
  }
  toggleBillingForm() {
    setTimeout(() => {
      this.getUserCredentials().then(res => {
        if (res === "ok") {
          if (this.first_name !== "" && this.last_name !== "") {
            this.billingForm.controls.nom.patchValue(this.first_name);
            this.billingForm.controls.prenom.patchValue(this.last_name);
            if (this.identityEntreprise === "") {
              this.buttonToggleGroup.value = "2";
              this.USER_TYPE = "2";
              this.billingForm.controls.addresse.patchValue(this.adresse);
              this.billingForm.controls.telephone.patchValue(this.phone);
              this.tab.select(1);
            } else {
              this.USER_TYPE = "1";
              this.buttonToggleGroup.value = "1";
              this.tab.select(1);
              this.billingForm.controls.addresse.patchValue(this.adresse);
              this.billingForm.controls.telephone.patchValue(this.phone);
              this.billingForm.controls.entrepriseName.patchValue(
                this.identityEntreprise
              );
              this.billingForm.controls.postal.patchValue(this.code_postal);
            }
          }
        }
      });
    }, 500);
  }
  buttonToggleChange(event: MatButtonToggleChange) {
    this.USER_TYPE = event.value;
    if (this.USER_TYPE === "1") {
      this.billingForm.controls.entrepriseName.setValidators([
        Validators.required,
        Validators.minLength(4)
      ]);
      this.billingForm.controls.postal.reset();
      this.billingForm.controls.postal.setValidators([
        Validators.required,
        Validators.minLength(4)
      ]);
      this.billingForm.controls.entrepriseName.reset();
      this.billingForm.controls.addresse.reset();
      this.billingForm.controls.telephone.reset();
      this.billingForm.controls.entrepriseName.updateValueAndValidity();
      this.billingForm.controls.postal.updateValueAndValidity();
      this.billingForm.controls.entrepriseName.patchValue(
        this.identityEntreprise
      );
      this.billingForm.controls.addresse.patchValue(this.adresse);
      this.billingForm.controls.telephone.patchValue(this.phone);
      this.billingForm.controls.postal.patchValue(this.code_postal);
    } else {
      this.billingForm.controls.entrepriseName.setValidators([
        Validators.nullValidator
      ]);
      this.billingForm.controls.postal.setValidators([
        Validators.nullValidator
      ]);
      this.billingForm.controls.entrepriseName.updateValueAndValidity();
      this.billingForm.controls.postal.updateValueAndValidity();
      this.billingForm.controls.addresse.reset();
      this.billingForm.controls.telephone.reset();
      this.billingForm.controls.addresse.patchValue(this.adresse);
      this.billingForm.controls.telephone.patchValue(this.phone);
    }
  }

  /*   onEntrepriseChange(event: MdbCheckboxChange) {
      if (event.checked === true) {
        this.particulierCheckbox.setDisabledState(true);
      } else {
        this.particulierCheckbox.setDisabledState(false);
      }
    }
    onParticulierChange(event: MdbCheckboxChange) {
      if (event.checked === true) {
        this.entrepriseCheckbox.setDisabledState(true);
      } else {
        this.entrepriseCheckbox.setDisabledState(false);
      }
    } */

  /*  getEntrepriseChecked() {
     if (this.billingForm.controls["entreprise"].value === true) {
       this.particulierCheckbox.setDisabledState(true);
     } else {
       this.particulierCheckbox.setDisabledState(false);
     }
     return this.billingForm.controls["entreprise"].value;
   }
   getParticulierChecked() {
     if (this.billingForm.controls["particulier"].value === true) {
       this.entrepriseCheckbox.setDisabledState(true);
     } else {
       this.entrepriseCheckbox.setDisabledState(false);
     }
     return this.billingForm.controls["particulier"].value;
   } */
  getUserCredentials(): Promise<string> {
    return new Promise(resolve => {
      this.auth.user.subscribe(child => {
        if (child !== null) {
          this.uid = child.uid;
          this.accountValue = child.account_value;
          this.first_name = child.first_name;
          this.last_name = child.last_name;
          this.adresse = child.addresse;
          this.identityEntreprise = child.entrepriseName;
          this.code_postal = child.postal;
          this.phone = child.telephone;

          resolve("ok");
        }
      });
    });
  }

  get addresse() {
    return this.billingForm.get("addresse");
  }
  get telephone() {
    return this.billingForm.get("telephone");
  }
  get nom() {
    return this.billingForm.get("nom");
  }
  get prenom() {
    return this.billingForm.get("prenom");
  }
  get entreprise() {
    return this.billingForm.get("entreprise");
  }
  get particulier() {
    return this.billingForm.get("particulier");
  }
  get entrepriseName() {
    return this.billingForm.get("entrepriseName");
  }
  public detectDevice(): Promise<any> {
    return new Promise(resolve => {
      resolve(this.deviceService.browser);
    });
  }

  public isMobile(): Promise<any> {
    return new Promise(resolve => {
      resolve(this.deviceService.isDesktop());
    });
  }

  public onOpenDialog = function (event: any): void {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  };
  // Sample level code to hide the Dialog when click the Dialog overlay
  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  openDialogPublish(src: string, err?:any) {
    const dialogRef = this.dialog.open(DialogPayment, {
      data: {src: src, err: err}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result===undefined){
        return;
      }else if(result==='publish'){
 
      }
    });
  }

  showSpinner: boolean = false
  addFunds() {
    if (this.paymentForm.valid) {

      this.montant = this.paymentForm.controls.amount.value * CURRENCY.DOLLAR;
      let amount: number = this.paymentForm.controls.amount.value
      let new_account_value = this.currentAccountValue + amount
      var browser = "";
      var redirect = "";
      this.detectDevice().then(res => {
        browser = res;

        if (browser === "Opera") {
          redirect = SERVER.opera;
        } else if (browser === "Chrome") {
          redirect = SERVER.chrome;
        } else if (browser === "Safari") {
          var current_browser_url = window.location.href;
          if (current_browser_url.includes("www")) {
            redirect = SERVER.safari1;
          } else {
            redirect = SERVER.safari2;
          }
        }

        var self = this;
        var key = this.generate(50);

        this.auth.updateUser(this.uid, { paymentKey: key }).then(res => {
          ////console.log("update user")
          if (res === "ok") {
            localStorage.setItem(key, this.montant.toString());
            //console.log(this.currentPaymentSelected)
            if (this.currentPaymentSelected === "PE") {
              this.showSpinner = true
              setTimeout(function () {
                var btn = document.getElementById("targetButton");
                var selector = pQuery(btn);
                new PayExpresse({
                  item_id: 1
                })
                  .withOption({
                    requestTokenUrl:
                      SERVER_URL + "/rechargeAccount/" +
                      self.montant + "/" + key + "/" +
                      redirect + "/" + self.aacid + "/" + self.uid + "/" + self.currentEmail + "/" + new_account_value + '/' + self.paymentForm.controls.amount.value,
                    method: "POST",
                    headers: {
                      Accept: "application/json"
                    },

                    prensentationMode: PayExpresse.OPEN_IN_POPUP,
                    didPopupClosed: function (
                      is_completed,
                      success_url,
                      cancel_url
                    ) {
                      if (is_completed === true) {
                      } else if (cancel_url) {

                        //window.location.href = cancel_url
                      }
                    },
                    willGetToken: function () {
                      ////////console.log("Je me prepare a obtenir un token");
                      selector.prop("disabled", true);
                      //var ads = []
                    },
                    didGetToken: function (token, redirectUrl) {
                      ////////console.log("Mon token est : " + token + ' et url est ' + redirectUrl);
                      self.showSpinner = false
                      selector.prop("disabled", false);
                    },
                    didReceiveError: function (error) {
                      //alert('erreur inconnu');
                      self.showSpinner = false
                      selector.prop("disabled", false);
                    },
                    didReceiveNonSuccessResponse: function (jsonResponse) {
                      ////////console.log('non success response ', jsonResponse);
                      //alert(jsonResponse.errors);
                      self.showSpinner = false
                      selector.prop("disabled", false);
                    }
                  })
                  .send({
                    pageBackgroundRadianStart: "#0178bc",
                    pageBackgroundRadianEnd: "#00bdda",
                    pageTextPrimaryColor: "#333",
                    paymentFormBackground: "#fff",
                    navControlNextBackgroundRadianStart: "#608d93",
                    navControlNextBackgroundRadianEnd: "#28314e",
                    navControlCancelBackgroundRadianStar: "#28314e",
                    navControlCancelBackgroundRadianEnd: "#608d93",
                    navControlTextColor: "#fff",
                    paymentListItemTextColor: "#555",
                    paymentListItemSelectedBackground: "#eee",
                    commingIconBackgroundRadianStart: "#0178bc",
                    commingIconBackgroundRadianEnd: "#00bdda",
                    commingIconTextColor: "#fff",
                    formInputBackgroundColor: "#eff1f2",
                    formInputBorderTopColor: "#e3e7eb",
                    formInputBorderLeftColor: "#7c7c7c",
                    totalIconBackgroundRadianStart: "#0178bc",
                    totalIconBackgroundRadianEnd: "#00bdda",
                    formLabelTextColor: "#292b2c",
                    alertDialogTextColor: "#333",
                    alertDialogConfirmButtonBackgroundColor: "#0178bc",
                    alertDialogConfirmButtonTextColor: "#fff"
                  });
              }, 500);
            } else {
              this.showSpinner = true
              let country_code = this.currentCountrySelected.toLowerCase();
              let provider = this.provider
              let currency: string = "XOF"
              if(country_code==='sn' || country_code==='ci' || country_code==='bf' || country_code==='cm'){
                if(country_code==='cm'){
                 currency = "XAF" 
              }
              let type: string = 'mobilemoney'
              if(this.provider==='card'){
                type='card'
              }
                this.requestBizaoAccessToken(type).then(token=>{
                  if(token!==null){
                    
                    this.requestBizaoPayement(token, currency, provider).then(data=>{
                    
                      if(data!==null && data.status!==undefined){
                        console.log(data)
                        this.paymentService.createPendingTransaction(this.uid, this.aacid, country_code, token, data).then((saved_pending)=>{
                          if(saved_pending==="ok"){
                            this.showSpinner = false
                            this.openDialogPublish(data.payment_url)

                          }else{
                            this.showSpinner = false
                          }
                        }).catch(()=>{
                          this.showSpinner = false
                        })
                        // let sectionPop = document.getElementById('block-popup'),
                        // iframe = document.getElementsByTagName('iframe')[0];
                        //iframe.src = data.payment_url;
                        // sectionPop.classList.remove('d-none');
                        //window.open(data.payment_url, '_blank')
                      }else{
                        this.showSpinner = false
                        this.openDialogPublish(data.payment_url, data)
                      }
                    }).catch(errCard=>{
                      this.showSpinner = false
                    })
                  }else{
                    this.showSpinner = false
                  }
                }).catch(e=>{
                  this.showSpinner = false
                })

                
              }
              if (this.currentPaymentSelected === 'MV') {
                provider = "moov"
              }
              let notifUrl: string = `https://us-central1-adafri-e5ceb.cloudfunctions.net/CALLBACK_SUCCESS_BIZAO?uid=${this.uid}&aacid=${this.aacid}&accountName=${this.currentAccountName}&amount_transaction=${amount.toString()}&email=${this.currentEmail}&new_account_value=${new_account_value.toString()}`

              let returnUrl: string = `https://v2.adafri.com/accounts/addFunds?aacid=${this.aacid}&auid=${this.uid}`
              const data = {
                amount: this.montant,
                returnUrl: returnUrl,
                cancelUrl: returnUrl,
                notifUrl: notifUrl,
                country: country_code,
                provider: provider

              };
              // this.http
              //   .post<BizaoResult>(`https://ads.adafri.com/api/v1/payments/bizao/`, data)
              //   .subscribe(
              //     response_bizao => {
              //       //console.log(response_bizao)
              //       if (parseInt(response_bizao.data.status.toString()) === 201) {
              //         this.showSpinner = false
              //         let url = response_bizao.data.payment_url
              //         window.location.assign(url)
              //       } else {
              //         this.showSpinner = false
              //       }
              //     },
              //     error => {
              //       this.showSpinner = false
              //       //console.log(error);
              //     }
              //   );
            }
          }
        });
      });
    } else {
      this.getErrorMessageRechargement();
    }
  }

  requestBizaoAccessToken(type: string):Promise<BIZAO_TOKEN_RESPONSE>{
    return new Promise(resolve=>{
      try{
        this.http.post<any>('https://us-central1-adafri-e5ceb.cloudfunctions.net/requestBizaoToken', {type: type}).pipe(take(1)).subscribe(resp=>{
          let res: BIZAO_TOKEN_RESPONSE = JSON.parse(resp.body)
          console.log(res)  
        if(res.access_token!==undefined && res.access_token!==null && res.access_token.length>0){
          resolve(res)
        }else{
          resolve(null)
        }
        }, err=>{
          console.log(err)
          resolve(null)
        })

      }catch(e){
        console.log(e)
        resolve(null)
      }
    })
  }

  closePopup() {
    document.getElementById('block-popup').classList.add('d-none');

}
  requestBizaoPayement(credentials: BIZAO_TOKEN_RESPONSE, currency: string, provider: string):Promise<BIZAO_CARD_RESPONSE>{
    return new Promise(resolve=>{
      try{
        this.montant = this.paymentForm.controls.amount.value * CURRENCY.DOLLAR;
        let amount: number = this.paymentForm.controls.amount.value
        let new_account_value = this.currentAccountValue + amount
        let endpoint: string = 'https://us-central1-adafri-e5ceb.cloudfunctions.net/requestBizaoMobileMoneyPayment'
        if(this.provider==='card'){
          endpoint = 'https://us-central1-adafri-e5ceb.cloudfunctions.net/requestBizaoCardDebit'
        }
        this.http.post<any>(endpoint, {
        uid: this.uid,
        aacid: this.aacid,
        email: this.currentEmail,
        credentials: credentials,
        accountName: this.currentAccountName,
        amount: amount,
        new_account_value: new_account_value,
        xof_value: parseInt(this.montant.toFixed(0)),
        countryCode: this.currentCountrySelected.toLowerCase(),
        currency: currency,
        provider: provider
        }).pipe(take(1)).subscribe(resp=>{
          console.log(resp)
          let res:BIZAO_CARD_RESPONSE = JSON.parse(resp.body)
        if(res.status!==undefined && res.status!==null && res.status===201){
          resolve(res)
        }else{
          resolve(res)
        }
        }, err=>{
          console.log(err)
          resolve(err)
        })
  
      }catch(e){
        console.log(e)
        resolve(null)
      }
    })
  }
  phoneValid: boolean = true
  phone_sate_change(arg: boolean){
    this.phoneValid = arg
  }
  hidden: boolean = false
  payWithPaydunya(btn) {
    if (this.paymentForm.valid) {
      if(this.applyTaxes){
        let value: number = this.paymentForm.controls.amount.value
        let fees: number = ((value * CURRENCY.DOLLAR * 3)/100) +110
        this.montant = parseInt(((value * CURRENCY.DOLLAR) + fees).toFixed(0))
      }else{
        this.montant = parseInt((this.paymentForm.controls.amount.value * CURRENCY.DOLLAR).toFixed(0));
      }
      let amount: number = this.paymentForm.controls.amount.value
      let new_account_value = this.currentAccountValue + amount
      var browser = "";
      var redirect = "";
      this.detectDevice().then(res => {
        browser = res;

        if (browser === "Opera") {
          redirect = SERVER.opera;
        } else if (browser === "Chrome") {
          redirect = SERVER.chrome;
        } else if (browser === "Safari") {
          var current_browser_url = window.location.href;
          if (current_browser_url.includes("www")) {
            redirect = SERVER.safari1;
          } else {
            redirect = SERVER.safari2;
          }
        }

        var self = this;
        var key = this.generate(50);
              this.showSpinner = true
              //console.log(PayDunya.DISPLAY_IN_POPUP)
                PayDunya.setup({
                  selector: $(btn),
                  url: SERVER_URL + "/rechargeAccountPayDunya/" +
                  self.montant + "/" + key + "/" +
                  redirect + "/" + self.aacid + "/" + self.uid + "/" + self.currentEmail + "/" + new_account_value + '/' + self.paymentForm.controls.amount.value+ '/' + self.channel_pa,
                  method: "GET",
                  displayMode: PayDunya.DISPLAY_IN_POPUP,
                  beforeRequest: function () {
                    //console.log("About to get a token and the url");
                    self.showSpinner = false
                },
                onSuccess: function (token) {
                    //console.log("Token: " +  token);
                    self.showSpinner = false
                },
                onTerminate: function (ref, token, status) {
                    //console.log(ref);
                    //console.log(token);
                    //console.log(status);
                    self.showSpinner = false
                },
                onError: (error)=> {
                  self.showSpinner = false
                },
                onUnsuccessfulResponse: function (jsonResponse) {
                    //console.log(jsonResponse)
                    //console.log("Unsuccessful response ==> " + jsonResponse);
                    self.showSpinner = false
                },
                onClose: ()=> {
                    //console.log("Close");
                    self.showSpinner = false
                }
              }).requestToken();
            
           
      });
    } else {
      this.getErrorMessageRechargement();
    }
    
}
  public focusIn(target: HTMLElement): void {
    target.parentElement.classList.add("e-input-focus");
  }

  public focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove("e-input-focus");
  }

  generate(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getErrorMessageRechargement() {
    return this.paymentForm.hasError("required")
      ? "Saisir un montant"
      : this.paymentForm.hasError("max")
        ? "Montant limite dÃƒÆ’Ã‚Â©passÃƒÆ’Ã‚Â©"
        : this.paymentForm.hasError("min")
          ? "Montant faible"
          : "";
  }
}


@Component({
  selector: 'dialog-payment',
  templateUrl: 'dialog-payment.html',
})
export class DialogPayment{
  errors: string = ''
  constructor(
    public dialogRef: MatDialogRef<DialogPayment>,
    @Inject(MAT_DIALOG_DATA) public data: {src: string, err?: string} ) {
      dialogRef.afterOpened().subscribe(()=>{
        if(data.err==undefined && data.err==null){
          setTimeout(() => {
            let iframe = document.getElementsByTagName('iframe')[0];
            iframe.src = data.src;  
          }, 500);

        }else{
          this.errors = JSON.stringify(this.data.err)
        }
      })
    }
    spinnePublication: boolean = false
    
    onNoClick(): void {
      this.dialogRef.disableClose = true
      this.dialogRef.close(undefined);
    }
  
}