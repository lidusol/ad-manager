import { Component, ViewChild, OnDestroy, OnInit, HostListener } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { ContentComponent } from './layout/content/content.component';
import { AuthService } from './auth/auth.service';
import { L10n, setCulture, loadCldr } from '@syncfusion/ej2-base';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { merge, Observable } from 'rxjs';
import { PresenceService } from './layout/presence.service';
import { LocalStorageService } from './layout/services/local-storage.service';
import { take } from 'rxjs/operators';
declare var require: any;
setCulture('fr-FR')
loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr/ca-gregorian.json'),
    require('cldr-data/main/fr/numbers.json'),
    require('cldr-data/main/fr/timeZoneNames.json'),
    require('cldr-data/supplemental/weekData.json') 
);
@Component({
  selector: 'adf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'material-app-adafri';
 showCard: boolean = false
 hidden = "hidden"
 loadScript() {
  let node = document.createElement('script'); // creates the script tag
  node.src = 'assets/js/google-chart.js'; // sets the source (insert url in between quotes)
  node.type = 'text/javascript'; // set the script type
  node.async = true; // makes script run asynchronously
  node.charset = 'utf-8';
  // append to head of document
  document.getElementsByTagName('head')[0].appendChild(node); 
}

loadVibrant() {
  let node = document.createElement('script'); // creates the script tag
  node.src = 'https://cdnjs.cloudflare.com/ajax/libs/vibrant.js/1.0.0/Vibrant.min.js'; // sets the source (insert url in between quotes)
  node.type = 'text/javascript'; // set the script type
  //node.integrity = 'sha512-V6rhYmJy8NZQF8F0bhJiTM0iI6wX/FKJoWvYrCM15UIeb6p38HjvTZWfO0IxJnMZrHWUJZJqLuWK0zslra2FVw=='
  node.async = true; // makes script run asynchronously
  node.charset = 'utf-8';
  // append to head of document
  document.getElementsByTagName('head')[0].appendChild(node); 
}

loadHotjar() {
  let node = document.createElement('script'); // creates the script tag
  node.src = 'assets/js/hotjar.js'; // sets the source (insert url in between quotes)
  node.type = 'text/javascript'; // set the script type
  //node.integrity = 'sha512-V6rhYmJy8NZQF8F0bhJiTM0iI6wX/FKJoWvYrCM15UIeb6p38HjvTZWfO0IxJnMZrHWUJZJqLuWK0zslra2FVw=='
  node.async = true; // makes script run asynchronously
  node.charset = 'utf-8';
  // append to head of document
  document.getElementsByTagName('head')[0].appendChild(node); 
}

epicFunction(): Promise<string> {
    return new Promise(resolve => {
      let deviceInfo: DeviceInfo = this.deviceService.getDeviceInfo();
      if (deviceInfo.browser !== 'Chrome') {
        this.showCard = true
      }
      /* this.isMobile = this.deviceService.isMobile();
      this.isTablet = this.deviceService.isTablet();
      this.isDesktopDevice = this.deviceService.isDesktop(); */
      resolve('ok')
       
     })
    }
 
/*     onchange (evt) {
      var v = "visible", h = "hidden",
          evtMap = {
            focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
          };
  
      evt = evt || window.event;
      if (evt.type in evtMap){
        document.body.className = evtMap[evt.type];
        ////console.log(evtMap[evt.type])
      }else{
        if(this.hidden==='hidden'){
          document.body.classList.remove('hidden')
          document.body.classList.add('visible')
        }else{
          document.body.classList.remove('visible')
          document.body.classList.add('hidden')
        }
      
        setTimeout(() => {
          ////console.log(document.body.classList)
          
        }, 1000);
  
      }
    } */

  loading = false;
  constructor(private route: ActivatedRoute, public presence: PresenceService, private router: Router, private auth: AuthService, private deviceService: DeviceDetectorService, private storageService: LocalStorageService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
          this.loading = false;
          this.epicFunction().then(getting => {
            
            
          })
          break;
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

  }

  public detectDevice(): Promise<any> {
    return new Promise(resolve => {
      resolve(this.deviceService.browser);
    });
  }
  ngOnDestroy(): void {
    ////console.log('component destroyed')
    this.auth.setUserInactive()
  }

 

loaderColor: string = 'accent'
defaultTheme: boolean = false
lightTheme: boolean =  false
checkBodyStyle(){
  this.storageService.getTheme().then(theme=>{
    //console.log(theme)
    if(theme!==undefined && theme!==null && (theme==='default' || theme==='light')){
      if(theme==='default'){
        this.loaderColor = 'accent'
        this.defaultTheme = true
        this.lightTheme = false
      }else if(theme==='light'){
        //console.log('isLightTheme')
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

  
}
  ngAfterViewInit(): void {
    
    this.checkBodyStyle()

    this.detectDevice().then(res => {
      let browser = res;

      if (browser === "Opera") {
        this.loadScript()
      } else if (browser === "Chrome") {
        this.loadScript()
      } else if (browser === "Safari") {
      }else {
        this.loadScript()
      }
      this.loadVibrant()
    })
    this.loadHotjar()
    
 
    
  }


 presence$: Observable<any>;
  ngOnInit(): void {
    //Start watching for user inactivity.
   
    this.auth.user.subscribe(data=>{
      if(data!==null){
        this.presence$ = this.presence.getPresence(data.uid);
        /* this.presence$.subscribe(item=>{
      
        }) */

      }
    })
    
    // Start watching when user idle is starting.
    //this.userIdle.onTimerStart().subscribe(count => //console.log(count));
  
    // Start watch when time is up.

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.onReady(()=> {
      
      document.getElementById('page').style.display = 'block'
  //this.setVisible('.page', true);
      this.setVisible('#loading', false);
      document.getElementById('loading').style.display = 'none'
       L10n.load({
          'fr-SN': {
        'chart': {
           DateRange:"Range"
        }
      },
            'fr': {
                'daterangepicker': {
                    placeholder: 'Choisissez les dates de votre campagne',
                    today:"Aujourd'hui",
                    startLabel: 'Date de début',
                    endLabel: 'Date de fin',
                    applyText: 'Appliquer',
                    cancelText: 'Annuler',
                    selectedDays: 'Jours sélectionnés',
                    days: 'Jours',
                    customRange: ''
          },
              grid: {
                EmptyRecord: 'Aucun élement trouvé',
                Add: 'Ajouter',
                Edit: "Modifier",
                Delete: "Supprimer",
                Update: "Enregistrer",
                Cancel: "Annuler",
                Search: "Rechercher",
                GroupDropArea: "Faites glisser une en-tête de colonne ici pour regrouper sa colonne",
                UnGroup: "Ciquez ici pour enlever le groupe",
                Columnchooser: "Colonne",
                Item: "element",
                Items: "elements",
                EditOperationAlert: "Aucun élément sélectionné",
                DeleteOperationAlert: "Aucun élément sélectionné",
                SaveButton: "Sauvegarder",
                CancelButton: "Annuler",
                EditFormTitle: "Modifier la campagne",
                ConfirmDelete: "Vous êtes sûr de vouloir supprimer cet enregistrement ?",
                CancelEdit: "Vous êtes sûr d'annuler ces changements ?",
                ChooseColumns: "Choisir une colonne",
                SearchColumns: "Rechercher une colonne",
                Matchs: "Aucune correspondance trouvée",
                Group: "Regrouper par cette colonne",
                Ungroup: "Dissocier par cette colonne",
                autoFitAll: "Ajustement automatique de toutes les colonnes",
                autoFit: "Ajuster automatiquement cette colonne",
                FirstPage: "Première page",
                LastPage: "Dernière page",
                All: "Tout",
                SortAscending: "Trier par ordre croissant",
                SortDescending: "Trier par ordre décroissant",
                EditRecord: "Modifier",
                DeleteRecord: "Supprimer",
                Copy: "Copier la sélection",
                SelectAll: "Tout sélectionner",
                Blanks: "Espaces",
                NoResult: "Aucun résultat",
                PreviousPage: "Page précédente",
                NextPage: "Page suivante"

              
           
           },
           chart: {
             "Monday": "Lundi"
            
           },
              datepicker: {
    placeholder: "Date",
                today: "Aujourd'hui",
   applyText: "Appliquer"
    },
              
          pager: {
            currentPageInfo: '{0} de {1} pages',
            totalItemsInfo: '({0} éléments)',
            firstPageTooltip: 'Aller à la première page',
            lastPageTooltip: 'Aller à la dernière page',
            nextPageTooltip: 'Page suivante',
            previousPageTooltip: 'Page précédente',
            nextPagerTooltip: 'Page précédente',
            previousPagerTooltip: 'Page suivante'
        },
                dropdowns: {
                    'noRecordsTemplate': "Aucun enregistrement trouvé",
                    'actionFailureTemplate': "Modèle d'échec d'action",
                    'overflowCountTemplate': "+${count} plus..",
                    'totalCountTemplate': "${count} choisi"
                }
       },
       });
 
    });

    this.route.queryParams.pipe(take(1)).subscribe(route=>{
      let source: string = route['utm_source']
      let content: string = route['utm_c']
      if(source!==undefined && source!==null && content!==undefined && content!==null){
          let utm: {iv: string, content: string} = {iv: source, content: content}
          this.storageService.setInvitationProvider(utm).then(fullySet=>{
            if(fullySet!==null){

            }else{
              
            }
          })

      }
    })

  }

   onReady(callback) {
  var intervalId = window.setInterval(function() {
    if (document.getElementsByTagName('body')[0] !== undefined) {
      window.clearInterval(intervalId);
      callback.call(this);
    }
  }, 1000);
}







 setVisible(selector, visible) {
  document.querySelector(selector).style.display = visible ? 'block' : 'none';
}
}
