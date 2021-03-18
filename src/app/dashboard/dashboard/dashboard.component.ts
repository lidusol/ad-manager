import { Component, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CampaignsOverviewRecapComponent } from 'src/app/layout/components/campaigns-overview-recap/campaigns-overview-recap.component';
import { LocalStorageService } from 'src/app/layout/services/local-storage.service';
import { AdOverviewRecapComponent } from 'src/app/layout/components/ad-overview-recap/ad-overview-recap.component';
import { User_Role } from 'src/app/utils/data';
import { PlacementsOverviewRecapComponent } from 'src/app/layout/components/placements-overview-recap/placements-overview-recap.component';
import { DisplayService } from 'src/app/campaigns-management/services/display.service';
import { DEFAULT_LANG, DESIGN_BOLD_ENDPOINT, SERVER } from 'src/environments/environment';
import { LayoutService } from 'src/app/layout/layout.service';
import { GeoPerformanceTargetComponent } from 'src/app/layout/components/geo-performance-target/geo-performance-target.component';
import { take } from 'rxjs/operators';
import { CampaignNativeOverviewRecapComponent } from 'src/app/layout/components/campaign-native-overview-recap/campaign-native-overview-recap.component';
import { NativeAdsOverviewRecapComponent } from 'src/app/layout/components/native-ads-overview-recap/native-ads-overview-recap.component';
import { AgePerformanceReportComponent } from 'src/app/layout/components/age-performance-report/age-performance-report.component';
import { GenderPerformanceReportComponent } from 'src/app/layout/components/gender-performance-report/gender-performance-report.component';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { CampaignSearchOverviewRecapComponent } from 'src/app/layout/components/campaign-search-overview-recap/campaign-search-overview-recap.component';
import { SearchAdsOverviewRecapComponent } from 'src/app/layout/components/search-ads-overview-recap/search-ads-overview-recap.component';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/layout/components/theme.service';
import { Subject } from 'rxjs';
import { LangService } from 'src/app/layout/components/lang.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'adf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public uid: string = ""
  public adf_account_id: string = ""
  DESCRIPTION_SHARE = "Hello 😎! Rends toi sur ADAFRI pour lancer toi aussi des pubs + facilement sur tout le web."
	@ViewChild(CampaignsOverviewRecapComponent, { static: false }) campaignsOverviewrecap: CampaignsOverviewRecapComponent
	@ViewChild(CampaignNativeOverviewRecapComponent, { static: false }) campaignsNativeOverviewrecap: CampaignNativeOverviewRecapComponent
	@ViewChild(AdOverviewRecapComponent, { static: false }) adsOverviewrecap: AdOverviewRecapComponent
	@ViewChild(CampaignSearchOverviewRecapComponent, { static: false }) campaignsSearchOverviewrecap: CampaignSearchOverviewRecapComponent
	@ViewChild(SearchAdsOverviewRecapComponent, { static: false }) adsSearchOverviewrecap: SearchAdsOverviewRecapComponent
	@ViewChild(NativeAdsOverviewRecapComponent, { static: false }) nativeAdsOverviewrecap: NativeAdsOverviewRecapComponent
	@ViewChild(SearchAdsOverviewRecapComponent, { static: false }) searchAdsOverviewrecap: SearchAdsOverviewRecapComponent
	@ViewChild(GeoPerformanceTargetComponent, { static: false }) geoPerformanceComponent: GeoPerformanceTargetComponent
	@ViewChild(AgePerformanceReportComponent, { static: false }) agePerformanceComponent: AgePerformanceReportComponent
	@ViewChild(GenderPerformanceReportComponent, { static: false }) gendersPerformanceComponent: GenderPerformanceReportComponent
  
  constructor(@Inject(DOCUMENT) private _document: Document,  private _renderer2: Renderer2,private themeService: ThemeService, private langService: LangService, private route: ActivatedRoute, private accountsService: AccountsService, private auth: AuthService, private storageService: LocalStorageService, private router: Router, private displayService: DisplayService, private layoutService: LayoutService, public translate: TranslateService) {
	//this.displayService.getUserInterestTaxonomy('VERTICAL_GEO')
	this.langService.language.subscribe(lang=>{
		this.translate.use(lang);
	})
	this.themeService.theme.subscribe(theme=>{
		if(theme!==undefined && theme!==null && (theme==='default' || theme==='light')){
			if(theme==='default'){
			  this.loaderColor = 'accent'
			  this.defaultTheme = true
			  this.lightTheme = false
			}else if(theme==='light'){
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
	  })
/* 	translate.use('en'); */
	/* translate.use(browserLang.match(/en|fr/) ? browserLang : 'en'); */
	
   /* this.displayService.getAdsSummuryReport(SERVER.CLIENT_CUSTOMER_ID) */
   let html: string = `<html xmlns="http://www.w3.org/1999/xhtml">

   <head>
   
   
	   <!-- Charset -->
	   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   
	   <!-- Mobile Viewport -->
	   <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0" />
	   
	   <link rel="stylesheet" href="style.css" />
	   <!-- Title -->
	   <title>Bienvenue sur Ad'Afri</title>
   
	   <!-- Styles -->
   
   <style>
   
   /* ----------- */
   /* -- Reset -- */
   /* ----------- */
   body {
	   margin: 0;
	   padding: 0;
	   mso-padding-alt: 0;
	   mso-margin-top-alt: 0;
	   width: 100% !important;
	   height: 100% !important;
	   mso-margin-bottom-alt: 0;
	   /*background-color: #f0f0f0;*/
   }
   
   body, table, td, p, a, li, blockquote {
	   -ms-text-size-adjust: 100%;
	   -webkit-text-size-adjust: 100%;
   }
   
   table { border-spacing: 0; }
   table, td {
	   mso-table-lspace: 0pt !important;
	   mso-table-rspace: 0pt !important;
   }
   
   img, a img {
	   border: 0;
	   outline: none;
	   text-decoration: none;  
   }
   img { -ms-interpolation-mode: bicubic; }
   
   p, h1, h2, h3, h4, h5, h6 {
	   margin: 0;
	   padding: 0;
   }
   
   .ReadMsgBody { width: 100%; }
   .ExternalClass { width: 100%; }
   .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
	   line-height: 100%;
   }
   
   #outlook a { padding: 0; }
   
   img{
	   max-width: 100%;
	   height: auto;
   }
   
   /* ---------------- */
   /* -- Responsive -- */
   /* ---------------- */
   @media only screen and (max-width: 620px) {
   
	   #foxeslab-email .table1 { width: 91% !important; }
	   #foxeslab-email .table1-2 { width: 98% !important; }
	   #foxeslab-email .table1-3 { width: 98% !important; }
	   #foxeslab-email .table1-4 { width: 98% !important; }
   
	   #foxeslab-email .tablet_no_float {
		   clear: both;
		   width: 100% !important;
		   margin: 0 auto !important;
		   text-align: center !important;
	   }
		#foxeslab-email .tablet_wise_float {
		   clear: both;
		   float: none !important;
		   width: auto !important;
		   margin: 0 auto !important;
		   text-align: center !important;
		}
   
	   #foxeslab-email .tablet_hide { display: none !important; }
   
	   #foxeslab-email .image1 { width: 100% !important; }
	   #foxeslab-email .image1-290 {
		   width: 100% !important;
		   max-width: 290px !important;
	   }
   
	   .center_content{
		   text-align: center !important;
	   }
	   .center_button{
		   width: 50% !important;
		   margin-left: 25% !important;
		   max-width: 300px !important;
	   }
   }
   
   
   @media only screen and (max-width: 479px) {
	   #foxeslab-email .table1 { width: 98% !important; }
	   #foxeslab-email .no_float {
		   clear: both;
		   width: 100% !important;
		   margin: 0 auto !important;
		   text-align: center !important;
	   }
		#foxeslab-email .wise_float {
		   clear: both;
		   float: none !important;
		   width: auto !important;
		   margin: 0 auto !important;
		   text-align: center !important;
		}
   
	   #foxeslab-email .mobile_hide { display: none !important; }
   
   }
   
   @media (max-width: 480px){
	   .container_400{
		   width: 95%;
	   }
   }
   </style>
   </head><!-- /head -->
   
   <body style="padding: 0;margin: 0;" id="foxeslab-email">
   <table class="table_full editable-bg-color bg_color_e6e6e6 editable-bg-image" bgcolor="#e6e6e6" width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0">
	   <!-- header -->
	   <tr>
		   <td>
			   <!-- container -->
			   <table class="table1 editable-bg-color bg_color_303f9f" bgcolor="#303f9f" width="600" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
				   <!-- padding-top -->
				   <tr><td height="25"></td></tr>
				   <tr>
					   <td>
						   <!-- Inner container -->
						   <table class="table1" width="520" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
							   <tr>
								   <td>
									   <!-- logo -->
									   <table width="50%" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr>
											   <td align="left">
												   <a href="#" class="editable-img">
													   <img editable="true" mc:edit="image001" src="https://app.adafri.com/assets/logo/logo-white.png" width="68" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt="logo" />
												   </a>
											   </td>
										   </tr>
										   <tr><td height="22"></td></tr>
									   </table><!-- END logo -->
   
									   <!-- options -->
								   
   
								   </td>
							   </tr>
   
							   <!-- horizontal gap -->
							   <tr><td height="60"></td></tr>
   
							   <tr>
								   <td align="center">
									   <div class="editable-img">
										   <img editable="true" mc:edit="image003" src="images/circle-icon-help.png"  style="display:block; line-height:0; font-size:0; border:0;" border="0" alt="" />
									   </div>
								   </td>
							   </tr>
   
							   <!-- horizontal gap -->
							   <tr><td height="40"></td></tr>
   
							   <tr>
								   <td mc:edit="text001" align="center" class="text_color_ffffff" style="color: #ffffff; font-size: 30px; font-weight: 700; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
									   <div class="editable-text">
										   <span class="text_container">
											   <multiline>
												   Commencer avec
											   </multiline>
										   </span>
									   </div>
								   </td>
							   </tr>
   
							   <!-- horizontal gap -->
							   <tr><td height="30"></td></tr>
   
							   <tr>
								   <td mc:edit="text002" align="center" class="text_color_ffffff" style="color: #ffffff; font-size: 12px; font-weight: 300; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
									   <div class="editable-text">
										   <span class="text_container">
											   <multiline>
												   Ad'Afri
											   </multiline>
										   </span>
									   </div>
								   </td>
							   </tr>
						   </table><!-- END inner container -->
					   </td>
				   </tr>
				   <!-- padding-bottom -->
				   <tr><td height="60"></td></tr>
			   </table><!-- END container -->
		   </td>
	   </tr>
	   
	   <!-- body -->
	   <tr>
		   <td>
			   <!-- container -->
			   <table class="table1 editable-bg-color bg_color_ffffff" bgcolor="#ffffff" width="600" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
				   <!-- padding-top -->
				   <tr><td height="60"></td></tr>
   
				   <tr>
					   <td>
						   <!-- inner container -->
						   <table class="table1" width="520" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
														   
							   <tr>
								   <td mc:edit="text003" align="center" class="text_color_282828" style="color: #282828; font-size: 18px; font-weight: 700; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
									   <div class="editable-text">
										   <span class="text_container">
											   <multiline>
												   Lance ta pub sur TOUT internet...et sur des applications mobiles
   
											   </multiline>
										   </span>
									   </div>
								   </td>
							   </tr>
							   
							   <!-- horizontal gap -->
							   <tr><td height="5"></td></tr>
   
									   <tr>
								   <td>
									   <!-- column-1  -->
									   <table class="table1-2" width="125" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr>
											   <td align="center">
												   <a href="#" style="border-style: none !important; display: block; border: 0 !important;" class="editable-img">
													   <img editable="true" mc:edit="image004" src="https://adafri.com/wp-content/uploads/2020/11/CANDY-640x640.png" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt="" />
												   </a>
											   </td>
										   </tr>
										   <!-- margin-bottom -->
										   <tr><td height="30"></td></tr>
									   </table><!-- END column-1 -->
   
									   <!-- vertical gap -->
									   <table class="tablet_hide" width="40" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr><td height="1"></td></tr>
									   </table>
   
									   <!-- column-2  -->
									   <table class="table1-2" width="355" align="left" border="0" cellspacing="0" cellpadding="0">
										   <!-- margin-top -->
										   <tr><td height="20"></td></tr>
										   <tr>
											   <td mc:edit="text005" align="left" class="center_content text_color_282828" style="color: #282828; font-size: 14px; font-weight: 600; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
												   <div class="editable-text">
													   <span class="text_container">
														   <multiline>
															   Une large audience
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
										   <!-- horizontal gap -->
										   <tr><td height="10"></td></tr>
   
										   <tr>
											   <td mc:edit="text006" align="left" class="center_content text_color_b0b0b0" style="color: #b0b0b0; font-size: 14px;line-height: 2; font-weight: 300; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
												   <div class="editable-text" style="line-height: 2;">
													   <span class="text_container">
														   <multiline>
														   Grâce à nous des millions de personnes peuvent voir ta publicité !
   Crée tes campagnes sur Google et même YouTube en utilisant ton téléphone pour payer…. et nul besoin de carte bancaire.
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
										   <!-- margin-bottom -->
										   <tr><td height="30"></td></tr>
									   </table><!-- END column-2 -->
								   </td>
							   </tr>
   
							   <tr>
								   <td>
									   <!-- column-1  -->
									   <table class="table1-2" width="125" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr>
											   <td align="center">
												   <a href="#" style="border-style: none !important; display: block; border: 0 !important;" class="editable-img">
													   <img editable="true" mc:edit="image005" src="https://adafri.com/wp-content/uploads/2020/11/box.png" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt="" />
												   </a>
											   </td>
										   </tr>
										   <!-- margin-bottom -->
										   <tr><td height="30"></td></tr>
									   </table><!-- END column-1 -->
   
									   <!-- vertical gap -->
									   <table class="tablet_hide" width="40" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr><td height="1"></td></tr>
									   </table>
   
									   <!-- column-2  -->
									   <table class="table1-2" width="355" align="left" border="0" cellspacing="0" cellpadding="0">
										   <!-- margin-top -->
										   <tr><td height="20"></td></tr>
										   <tr>
											   <td mc:edit="text007" align="left" class="center_content text_color_282828" style="color: #282828; font-size: 14px; font-weight: 600; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
												   <div class="editable-text">
													   <span class="text_container">
														   <multiline>
															   Décide et fixe le montant de ta campagne
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
										   <!-- horizontal gap -->
										   <tr><td height="10"></td></tr>
   
										   <tr>
											   <td mc:edit="text008" align="left" class="center_content text_color_b0b0b0" style="color: #b0b0b0; font-size: 14px;line-height: 2; font-weight: 300; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
												   <div class="editable-text" style="line-height: 2;">
													   <span class="text_container">
														   <multiline>
															   Adafri est taillé sur mesure pour tout type de budget ! Vérifie le nombre d’impressions, de clics et obtient une analyse poussée de tes visiteurs.
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
										   <!-- margin-bottom -->
										   <tr><td height="30"></td></tr>
									   </table><!-- END column-2 -->
								   </td>
							   </tr>
   
							   <tr>
								   <td>
									   <!-- column-1  -->
									   <table class="table1-2" width="125" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr>
											   <td align="center">
												   <a href="#" style="border-style: none !important; display: block; border: 0 !important;" class="editable-img">
													   <img editable="true" mc:edit="image005" src="https://adafri.com/wp-content/uploads/2020/11/tel3.png" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt="" />
												   </a>
											   </td>
										   </tr>
										   <!-- margin-bottom -->
										   <tr><td height="30"></td></tr>
									   </table><!-- END column-1 -->
   
									   <!-- vertical gap -->
									   <table class="tablet_hide" width="40" align="left" border="0" cellspacing="0" cellpadding="0">
										   <tr><td height="1"></td></tr>
									   </table>
   
									   <!-- column-2  -->
									   <table class="table1-2" width="355" align="left" border="0" cellspacing="0" cellpadding="0">
										   <!-- margin-top -->
										   <tr><td height="20"></td></tr>
										   <tr>
											   <td mc:edit="text009" align="left" class="center_content text_color_282828" style="color: #282828; font-size: 14px; font-weight: 600; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
												   <div class="editable-text">
													   <span class="text_container">
														   <multiline>
															   Cible par zone Géographique
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
										   <!-- horizontal gap -->
										   <tr><td height="10"></td></tr>
   
										   <tr>
											   <td mc:edit="text010" align="left" class="center_content text_color_b0b0b0" style="color: #b0b0b0; font-size: 14px;line-height: 2; font-weight: 300; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
												   <div class="editable-text" style="line-height: 2;">
													   <span class="text_container">
														   <multiline>
															   En plus d’un ciblage par âge et genre de tes prospects, tu auras la possibilité d’affiner selon des critères de zones spécifiques (ex: Paris - 18ème, Memorz - sacré-cœur, ou même Dakar région ).
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
										   <!-- margin-bottom -->
										   <tr><td height="30"></td></tr>
									   </table><!-- END column-2 -->
								   </td>
							   </tr>
   
							   <!-- horizontal gap -->
							   <tr><td height="35"></td></tr>
							   
							   <tr>
								   <td>
									   <!-- button -->
									   <table class="button_bg_color_303f9f bg_color_303f9f" bgcolor="#303f9f" width="225" height="50" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:#303f9f; border-radius:3px;">
										   <tr>
											   <td mc:edit="text008" align="center" valign="middle" style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;" class="text_color_ffffff">
												   <div class="editable-text">
													   <span class="text_container">
														   <multiline>
															   <a href="https://app.adafri.com" style="text-decoration: none; color: #ffffff;">Commencer</a>
														   </multiline>
													   </span>
												   </div>
											   </td>
										   </tr>
									   </table><!-- END button -->
								   </td>
							   </tr>
   
						   </table><!-- END inner container -->
					   </td>
				   </tr>
   
				   <!-- padding-bottom -->
				   <tr><td height="60"></td></tr>
			   </table><!-- END container -->
		   </td>
	   </tr>
   
	   <!-- footer -->
	   <tr>
		   <td>
			   <!-- container -->
			   <table class="table1" width="600" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
				   <!-- padding-top -->
				   <tr><td height="40"></td></tr>
   
				   <tr>
					   <td>
						   <!--  column-1 -->
						   <table class="table1-2" width="350" align="center" border="0" cellspacing="0" cellpadding="0">
							   <tr>
								   <td mc:edit="text009" align="center" class="center_content text_color_929292" style="color: #929292; font-size: 14px; line-height: 2; font-weight: 400; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
									   <div class="editable-text" style="line-height: 2;">
										   <span class="text_container">
											   <multiline>
												   Cette notification relative au service vous a été envoyée par e-mail afin de vous informer de changements importants apportés à votre compte Ad'Afri.
											   </multiline>
										   </span>
									   </div>
								   </td>
							   </tr>
   
							   <!-- horizontal gap -->
							   <tr><td height="20"></td></tr>
   
							   <tr>
								   <td mc:edit="text010" align="center" class="center_content" style="font-size: 14px;font-weight: 400; font-family: lato, Helvetica, sans-serif; mso-line-height-rule: exactly;">
									   <div class="editable-text">
										   <span class="text_container">
											   <multiline>
												   <a href="#" class="text_color_929292" style="color:#929292; text-decoration: none;">Adafri Inc, Dakar, Mermoz VDN Villa 7287</a>
											   </multiline>
										   </span>
									   </div>
								   </td>
							   </tr>
   
							   <!-- horizontal gap -->
							   <tr><td height="10"></td></tr>
   
							   <!-- margin-bottom -->
							   <tr><td height="30"></td></tr>
						   </table><!-- END column-1 -->
   
						   <!-- vertical gap -->
						   <table class="tablet_hide" width="130" align="left" border="0" cellspacing="0" cellpadding="0">
							   <tr><td height="1"></td></tr>
						   </table>
   
						   <!-- column-2  -->
						   <table class="table1-2" width="120" align="right" border="0" cellspacing="0" cellpadding="0">
							   <tr>
								   <td>
									   <table width="120" align="center" style="margin: 0 auto;">
										   <tr>
											   <!-- facebook -->
											   <td align="center" width="30">
												   <a href="https://m.facebook.com/Adforafrica/" style="border-style: none !important; display: inline-block;; border: 0 !important;" class="editable-img">
												   <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDI5MS4zMTkgMjkxLjMxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjkxLjMxOSAyOTEuMzE5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojM0I1OTk4OyIgZD0iTTE0NS42NTksMGM4MC40NSwwLDE0NS42Niw2NS4yMTksMTQ1LjY2LDE0NS42NmMwLDgwLjQ1LTY1LjIxLDE0NS42NTktMTQ1LjY2LDE0NS42NTkNCgkJUzAsMjI2LjEwOSwwLDE0NS42NkMwLDY1LjIxOSw2NS4yMSwwLDE0NS42NTksMHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTE2My4zOTQsMTAwLjI3N2gxOC43NzJ2LTI3LjczaC0yMi4wNjd2MC4xYy0yNi43MzgsMC45NDctMzIuMjE4LDE1Ljk3Ny0zMi43MDEsMzEuNzYzaC0wLjA1NQ0KCQl2MTMuODQ3aC0xOC4yMDd2MjcuMTU2aDE4LjIwN3Y3Mi43OTNoMjcuNDM5di03Mi43OTNoMjIuNDc3bDQuMzQyLTI3LjE1NmgtMjYuODF2LTguMzY2DQoJCUMxNTQuNzkxLDEwNC41NTYsMTU4LjM0MSwxMDAuMjc3LDE2My4zOTQsMTAwLjI3N3oiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" editable="true" mc:edit="image004" width="30" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt=""/>											   
												   </a>
											   </td>
        
											   <!-- vertical gap -->
											   <td width="15"></td>
											   <td align="center" width="30">
												   <a href="https://www.instagram.com/adafrisn/" style="border-style: none !important; display: inline-block;; border: 0 !important;" class="editable-img">
												   <img src="data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNCAyNCIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC0xLjk4MiAtMS44NDQgMCAtMTMyLjUyMiAtNTEuMDc3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItMzcuMTA2IiB4Mj0iLTI2LjU1NSIgeTE9Ii03Mi43MDUiIHkyPSItODQuMDQ3Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZDUiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjZmY1NDNlIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYzgzN2FiIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBkPSJtMS41IDEuNjMzYy0xLjg4NiAxLjk1OS0xLjUgNC4wNC0xLjUgMTAuMzYyIDAgNS4yNS0uOTE2IDEwLjUxMyAzLjg3OCAxMS43NTIgMS40OTcuMzg1IDE0Ljc2MS4zODUgMTYuMjU2LS4wMDIgMS45OTYtLjUxNSAzLjYyLTIuMTM0IDMuODQyLTQuOTU3LjAzMS0uMzk0LjAzMS0xMy4xODUtLjAwMS0xMy41ODctLjIzNi0zLjAwNy0yLjA4Ny00Ljc0LTQuNTI2LTUuMDkxLS41NTktLjA4MS0uNjcxLS4xMDUtMy41MzktLjExLTEwLjE3My4wMDUtMTIuNDAzLS40NDgtMTQuNDEgMS42MzN6IiBmaWxsPSJ1cmwoI1NWR0lEXzFfKSIvPjxwYXRoIGQ9Im0xMS45OTggMy4xMzljLTMuNjMxIDAtNy4wNzktLjMyMy04LjM5NiAzLjA1Ny0uNTQ0IDEuMzk2LS40NjUgMy4yMDktLjQ2NSA1LjgwNSAwIDIuMjc4LS4wNzMgNC40MTkuNDY1IDUuODA0IDEuMzE0IDMuMzgyIDQuNzkgMy4wNTggOC4zOTQgMy4wNTggMy40NzcgMCA3LjA2Mi4zNjIgOC4zOTUtMy4wNTguNTQ1LTEuNDEuNDY1LTMuMTk2LjQ2NS01LjgwNCAwLTMuNDYyLjE5MS01LjY5Ny0xLjQ4OC03LjM3NS0xLjctMS43LTMuOTk5LTEuNDg3LTcuMzc0LTEuNDg3em0tLjc5NCAxLjU5N2M3LjU3NC0uMDEyIDguNTM4LS44NTQgOC4wMDYgMTAuODQzLS4xODkgNC4xMzctMy4zMzkgMy42ODMtNy4yMTEgMy42ODMtNy4wNiAwLTcuMjYzLS4yMDItNy4yNjMtNy4yNjUgMC03LjE0NS41Ni03LjI1NyA2LjQ2OC03LjI2M3ptNS41MjQgMS40NzFjLS41ODcgMC0xLjA2My40NzYtMS4wNjMgMS4wNjNzLjQ3NiAxLjA2MyAxLjA2MyAxLjA2MyAxLjA2My0uNDc2IDEuMDYzLTEuMDYzLS40NzYtMS4wNjMtMS4wNjMtMS4wNjN6bS00LjczIDEuMjQzYy0yLjUxMyAwLTQuNTUgMi4wMzgtNC41NSA0LjU1MXMyLjAzNyA0LjU1IDQuNTUgNC41NSA0LjU0OS0yLjAzNyA0LjU0OS00LjU1LTIuMDM2LTQuNTUxLTQuNTQ5LTQuNTUxem0wIDEuNTk3YzMuOTA1IDAgMy45MSA1LjkwOCAwIDUuOTA4LTMuOTA0IDAtMy45MS01LjkwOCAwLTUuOTA4eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==" editable="true" mc:edit="image004" width="30" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt=""/>
													  
												   </a>
											   </td>
        
   
											   <!-- vertical gap -->
											   <td width="15"></td>
   
											   <!-- google+ -->
											   <td align="center" width="30">
												   <a href="https://www.linkedin.com/company/adafri" style="border-style: none !important; display: inline-block;; border: 0 !important;" class="editable-img">
												   <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDM4MiAzODIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDM4MiAzODI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiMwMDc3Qjc7IiBkPSJNMzQ3LjQ0NSwwSDM0LjU1NUMxNS40NzEsMCwwLDE1LjQ3MSwwLDM0LjU1NXYzMTIuODg5QzAsMzY2LjUyOSwxNS40NzEsMzgyLDM0LjU1NSwzODJoMzEyLjg4OQ0KCUMzNjYuNTI5LDM4MiwzODIsMzY2LjUyOSwzODIsMzQ3LjQ0NFYzNC41NTVDMzgyLDE1LjQ3MSwzNjYuNTI5LDAsMzQ3LjQ0NSwweiBNMTE4LjIwNywzMjkuODQ0YzAsNS41NTQtNC41MDIsMTAuMDU2LTEwLjA1NiwxMC4wNTYNCglINjUuMzQ1Yy01LjU1NCwwLTEwLjA1Ni00LjUwMi0xMC4wNTYtMTAuMDU2VjE1MC40MDNjMC01LjU1NCw0LjUwMi0xMC4wNTYsMTAuMDU2LTEwLjA1Nmg0Mi44MDYNCgljNS41NTQsMCwxMC4wNTYsNC41MDIsMTAuMDU2LDEwLjA1NlYzMjkuODQ0eiBNODYuNzQ4LDEyMy40MzJjLTIyLjQ1OSwwLTQwLjY2Ni0xOC4yMDctNDAuNjY2LTQwLjY2NlM2NC4yODksNDIuMSw4Ni43NDgsNDIuMQ0KCXM0MC42NjYsMTguMjA3LDQwLjY2Niw0MC42NjZTMTA5LjIwOCwxMjMuNDMyLDg2Ljc0OCwxMjMuNDMyeiBNMzQxLjkxLDMzMC42NTRjMCw1LjEwNi00LjE0LDkuMjQ2LTkuMjQ2LDkuMjQ2SDI4Ni43Mw0KCWMtNS4xMDYsMC05LjI0Ni00LjE0LTkuMjQ2LTkuMjQ2di04NC4xNjhjMC0xMi41NTYsMy42ODMtNTUuMDIxLTMyLjgxMy01NS4wMjFjLTI4LjMwOSwwLTM0LjA1MSwyOS4wNjYtMzUuMjA0LDQyLjExdjk3LjA3OQ0KCWMwLDUuMTA2LTQuMTM5LDkuMjQ2LTkuMjQ2LDkuMjQ2aC00NC40MjZjLTUuMTA2LDAtOS4yNDYtNC4xNC05LjI0Ni05LjI0NlYxNDkuNTkzYzAtNS4xMDYsNC4xNC05LjI0Niw5LjI0Ni05LjI0Nmg0NC40MjYNCgljNS4xMDYsMCw5LjI0Niw0LjE0LDkuMjQ2LDkuMjQ2djE1LjY1NWMxMC40OTctMTUuNzUzLDI2LjA5Ny0yNy45MTIsNTkuMzEyLTI3LjkxMmM3My41NTIsMCw3My4xMzEsNjguNzE2LDczLjEzMSwxMDYuNDcyDQoJTDM0MS45MSwzMzAuNjU0TDM0MS45MSwzMzAuNjU0eiIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" editable="true" mc:edit="image006" width="30" style="display:block; line-height:0; font-size:0; border:0;" border="0" alt="" />
													   
												   </a>
											   </td>
										   </tr>
									   </table>
								   </td>
							   </tr>
							   <!-- margin-bottom -->
							   <tr><td height="30"></td></tr>
						   </table><!-- END column-2 -->
					   </td>
				   </tr>
   
				   <!-- padding-bottom -->
				   <tr><td height="70"></td></tr>
			   </table><!-- END container -->
		   </td>
	   </tr>
   </table>
   </body>`
//    this.layoutService.sendMail('no-reply', 'ibrahima2597@gmail.com', 'test mail', html)
  }
  
	chart: any;
	isLoading = true

  ngOnInit(): void {
	  /* this.layoutService.getIPAddress() */
    /* this.chart = new CanvasJS.Chart("chartContainer", {
      culture: 'fr',
	animationEnabled: true,
	
	axisX: {
		interval: 1,
    //intervalType: "month",
    valueFormatString: "MMM YYYY"
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
		itemclick: this.toogleDataSeries
	},
  
	toolTip: {
		shared: true
	},
	data: [{
		name: "Clics",
	type: "line",
		xValueFormatString: "MMM, YYYY",
		showInLegend: "true",
		dataPoints: [
			{ x: new Date(2017, 1, 6), y: 220 },
			{ x: new Date(2017, 1, 7), y: 120 },
			{ x: new Date(2017, 1, 8), y: 144 },
			{ x: new Date(2017, 1, 9), y: 162 },
			{ x: new Date(2017, 1, 10), y: 129 },
			{ x: new Date(2017, 1, 11), y: 109 },
			{ x: new Date(2017, 1, 12), y: 129 }
		]
	},
	{
		name: "Coûts",
		type: "line",
		xValueFormatString: "MMM, YYYY",
		showInLegend: "true",
		dataPoints: [
			{ x: new Date(2017, 1, 6), y: 42 },
			{ x: new Date(2017, 1, 7), y: 34 },
			{ x: new Date(2017, 1, 8), y: 29 },
			{ x: new Date(2017, 1, 9), y: 42 },
			{ x: new Date(2017, 1, 10), y: 53},
			{ x: new Date(2017, 1, 11), y: 15 },
			{ x: new Date(2017, 1, 12), y: 12 }
		]
    },
  {
		name: "Impressions",
		type: "line",
		xValueFormatString: "MMM, YYYY",
		showInLegend: "true",
		dataPoints: [
			{ x: new Date(2017, 1, 6), y: 104 },
			{ x: new Date(2017, 1, 7), y: 343 },
			{ x: new Date(2017, 1, 8), y: 230 },
			{ x: new Date(2017, 1, 9), y: 420 },
			{ x: new Date(2017, 1, 10), y: 533},
			{ x: new Date(2017, 1, 11), y: 153 },
			{ x: new Date(2017, 1, 12), y: 123 }
		]
	}]
});
		
	this.chart.render(); */
  }
  loaderColor: string = 'accent'
  defaultTheme: boolean = true
  lightTheme: boolean =  false

 

	showCampaignsBlock: boolean = false
	aacid: string = ""
	email: string = ""
	account_name: string = ""
	public user_access: User_Role = undefined
	showCard: boolean = false
	  text_greeting: string = ""
	  user_company: string = ""
	checkMoment(){
		var today = new Date()
		var curHr = today.getHours()
		if (curHr >= 0 && curHr < 5) {
			this.text_greeting = 'good_evening'
		////console.log('good evening')
		}else if (curHr >= 5 && curHr < 12) {
			this.text_greeting = 'good_morning'
		////console.log('good morning')
		} else if (curHr >= 12 && curHr < 17) {
			this.text_greeting = 'good_afternoon'
		////console.log('good afternoon')
		} else {
			this.text_greeting = 'good_evening'
		////console.log('good evening')
		}
	}
  utm_source: {iv: string, content: string} = null
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
		
		  this.storageService.getUserIdAndAccountId().then(response => {
			  if (response !== null) {
				  this.route.queryParams.pipe(take(1)).subscribe(params => {
					  if(params['code']===undefined){
						  const adf_account_id: string = params['aacid'];
							 const uid = params['auid'];
							 if (response.aacid === adf_account_id && uid === response.auid && adf_account_id!==undefined && uid!==undefined) {
								 this.aacid = adf_account_id
								 this.uid = response.auid
								 this.user_access = response.role
								  this.email= response.email
								  this.account_name = response.account.name
								  this.user_company = response.user_company
								  this.isLoading = false
								  setTimeout(() => {
									  this.checkMoment()
									  this.campaignsOverviewrecap.user_access = this.user_access
									  this.campaignsOverviewrecap.getData()
									  this.storageService.userAccountIdEncryption(this.aacid).then(hash=>{
										//console.log(hash)
										  if(hash===null){
											  this.utm_source = null
										}else{
											this.utm_source = hash
										  }
									  })
								//    this.campaignsNativeOverviewrecap.user_access = this.user_access
								//    this.campaignsSearchOverviewrecap.user_access = this.user_access
								//    this.adsOverviewrecap.user_role = this.user_access
								//    this.nativeAdsOverviewrecap.user_role = this.user_access
								//    this.searchAdsOverviewrecap.user_role = this.user_access
								// 	 this.campaignsOverviewrecap.getData()
								// 	 this.campaignsNativeOverviewrecap.getData()
								// 	 this.campaignsSearchOverviewrecap.getData()
								//  this.adsOverviewrecap.getData()
								//  this.nativeAdsOverviewrecap.getData()
								//  this.searchAdsOverviewrecap.getData()
								//  this.geoPerformanceComponent.aacid = response.aacid
								//  this.geoPerformanceComponent.uid = response.account.owner
								//  this.geoPerformanceComponent.getGeoPerformanceReportData()
								//  this.agePerformanceComponent.aacid = response.aacid
								//  this.agePerformanceComponent.uid = response.account.owner
								//  this.agePerformanceComponent.getAgePerformanceReportData()
								//  this.gendersPerformanceComponent.aacid = response.aacid
								//  this.gendersPerformanceComponent.uid = response.account.owner
								//  this.gendersPerformanceComponent.getGendersPerformanceReportData()
								 }, 500);
								 
							 } else {
								 this.router.navigate(['/overview'], { queryParams: { aacid: response.aacid, auid: response.auid } }).then(() => {
									 this.isLoading = false
									 setTimeout(() => {
										this.checkMoment()
										 this.campaignsOverviewrecap.user_access = this.user_access
										this.campaignsOverviewrecap.getData()
										this.storageService.userAccountIdEncryption(response.aacid).then(hash=>{
											//console.log(hash)
											if(hash===null){
												this.utm_source = null
										  }else{
											  this.utm_source = hash
											}
										})
									// 	 this.campaignsNativeOverviewrecap.user_access = this.user_access
									// 	 this.campaignsSearchOverviewrecap.user_access = this.user_access
									//    this.adsOverviewrecap.user_role = this.user_access
									//    this.nativeAdsOverviewrecap.user_role = this.user_access
									//    this.searchAdsOverviewrecap.user_role = this.user_access
									// 	 this.campaignsNativeOverviewrecap.getData()
									// 	 this.campaignsSearchOverviewrecap.getData()
									// 	 this.adsOverviewrecap.getData()
									// 	 this.nativeAdsOverviewrecap.getData()
									// 	 this.searchAdsOverviewrecap.getData()
								// 		 this.geoPerformanceComponent.aacid = response.aacid
								// 		 this.geoPerformanceComponent.uid = response.account.owner
								// 		 this.geoPerformanceComponent.getGeoPerformanceReportData()
								// 		 this.agePerformanceComponent.aacid = response.aacid
								// 	   this.agePerformanceComponent.uid = response.account.owner
								// 	   this.agePerformanceComponent.getAgePerformanceReportData()
								// 	   this.gendersPerformanceComponent.aacid = response.aacid
								//  this.gendersPerformanceComponent.uid = response.account.owner
								//  this.gendersPerformanceComponent.getGendersPerformanceReportData()
										 /* this.placementOverviewrecap.getData() */
										 
											  
									 }, 1000);
									 
								 })
							 }

					  }else{
						let code = params['code']
						this.auth.getAuthFlowCredentials(response.aacid, code).then((value)=>{
							if(value!==null){
								window.location.replace('loclhost:4200')
							}else{
								alert('authentication failure !')
							}
						})
					  }
			 
				 })
				
			}
		})
	/* 	this.interval_refresh = setInterval(()=>{
		},500) */
		/* this.checkBodyStyle()
		this.getLang() */
      
  
  }
  interval_refresh: any;
  loader: boolean = false
  discoverEditor(){
	this.addDesignBold('', 300, 250)
	setTimeout(() => {
		if(document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==undefined && document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==null){
		  document.getElementById('resizeContainer').getElementsByTagName('a')[0].click();
		  this.loader = false
		}else{
		  setTimeout(() => {
			if(document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==undefined && document.getElementById('resizeContainer').getElementsByTagName('a')[0]!==null){
			  document.getElementById('resizeContainer').getElementsByTagName('a')[0].click();
			  this.loader = false
			}else{
	  
			}
		  }, 1000);
		}
	  }, 1000);
  }
  currentWidth: number = 0
  currentHeight: number = 0
  addDesignBold(name: string, width: number, height: number){
    //let ref= document.getElementById('resizeContainer').getElementsByTagName('a')
    let parent = document.getElementById('resizeContainer')
    parent.style.visibility = "hidden"
    parent.style.height="10px"
    parent.style.overflow="hidden"
    let div = document.createElement('div')
    //div.id = 'btn-resize'
    div.classList.add('db-btn-design-me')
    //div.style.visibility = 'hidden'
    div.setAttribute('data-db-width', width.toString())
    div.setAttribute('data-db-height', height.toString())
    div.setAttribute('data-db-title', name)
    div.setAttribute('data-db-unit', 'px')
    //console.log(ref)
    if(this.currentWidth===0 || this.currentHeight!==width || this.currentHeight!==height){
      div.setAttribute('data-db-action', 'create')
      this.currentWidth=width
      this.currentHeight = height
      parent.appendChild(div)
    this.loadDesignBold()
    }else{
      if(this.currentHeight===width && this.currentHeight===height){
        div.setAttribute('data-db-action', 'edit')
      this.currentWidth=width
      this.currentHeight = height
    this.loadDesignBold(true)
      }else{
        div.setAttribute('data-db-action', 'create')
      this.currentWidth=width
      this.currentHeight = height
      parent.appendChild(div)
    this.loadDesignBold()
      }
    }
    
  }

  loadDesignBold(remove?: boolean) {
    let ref= document.getElementById('resizeContainer').getElementsByTagName('a')
    console.log(ref)
    if(ref[0]!==undefined && ref[0]!==null){
      if(remove===undefined){
        ref[0].remove()
        document.getElementById('db-js-sdk').remove()
        setTimeout(() => {
          let script = this._renderer2.createElement('script');
          script.type = `text/javascript`;
          script.src = DESIGN_BOLD_ENDPOINT
          script.id = "db-js-sdk"
          this._renderer2.appendChild(this._document.body, script);
          window['DBSDK_Cfg'] = {
            export_mode: ['download'],
            export_file_type: 'png',
            export_callback: (resultUrl, documentId, exportTarget)=> {
            
            },
            auth: {
              //quick sign up config, fill partner user email & user display name
                name : 'Connectez-vous pour commencer',
                email : this.email
            }
            };
        }, 500);
      }
    }else{
      let script = this._renderer2.createElement('script');
      script.type = `text/javascript`;
      script.src = DESIGN_BOLD_ENDPOINT
      script.id = "db-js-sdk"
      this._renderer2.appendChild(this._document.body, script);
      window['DBSDK_Cfg'] = {
        export_mode: ['download'],
        export_file_type: 'png',
        export_callback: (resultUrl, documentId, exportTarget) =>{
  
        },
        auth: {
          //quick sign up config, fill partner user email & user display name
          name : 'Connectez-vous pour commencer',
          email : this.email
        }
        };
    }
//     var self = this;
//   (function (d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src ="https://sdk.designbold.com/button.js#app_id=d46eb0dd68";
// fjs.parentNode.insertBefore(js, fjs);

// }(document, 'script', 'db-js-sdk'));




  }
  ngOnDestroy(): void {
	//Called once, before the instance is destroyed.
	//Add 'implements OnDestroy' to the class.
/* 	if(this.interval_refresh!==undefined && this.interval_refresh!==null){
	  clearInterval(this.interval_refresh)
  
	} */
  }

/* 	getReport() {
		this.displayService.getPlacementSummuryReport()
	} */
	createCampaign() {

      this.router.navigate(['/campaigns/new/select'], {queryParams: {aacid: this.aacid, auid: this.uid}})
    
  }
}
