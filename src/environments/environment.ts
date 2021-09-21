// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};
 export const SERVER = {
  url: "http://127.0.0.1:5000",

  url_redirect: "http://localhost:4200",
  confidentialite: "http://localhost:4200/#/confidentialite",
  chrome: "localhost:4200",
  opera: "localhost:4200",
  safari1: "localhost:4200",
  safari2: "localhost:4200",
  protocol: "http://",
  intouch: "http://164.68.124.77:5151/orders/",
  PRIVATE_KEY_WEB_PUSH: "AAAAo6i75Aw:APA91bHotUez_nc9pULUYt_TCXpEzMaLa8Eclg9-wE9NSTkJ-zaHS8HWMOf4IMS00f_6k5Ghk6BdrH85GtBdhwn301ndP-smPhc65tyRunl9OI7qhwwx4oyf7gsOErXYJcxG7Q0JRQuk",
  //CLIENT_CUSTOMER_ID: 6783128225
  CLIENT_CUSTOMER_ID: 4641424813,
  FIRST_CLIENT_CUSTOMER_ID: 6783128225,
  SECOND_CLIENT_CUSTOMER_ID: 4641424813
  

}

export const ADAFRI_BUSINESS_ID: string = '906867576360885'
export const FACEBOOK_ACCESS_TOKEN: string = "EAAb7opU2rPQBAHGKfCTIM79xr9PQhAt0zjE6SIVixtcKaNiu7tsZBDZBnOzmMN1oppA7PGDezU9ZADZBzjAVp8k6p5TFHeKcLOA4qYAHl855S78yWXLwWsgFbWGLETUz48xkP7xwjAid2yXJn3Dlo4ZCz1ppHCf2gDdND0efTZC7ZBHDZCMSOCzlKpi5DUSBXlm2a2x3h7DdZAMyCs19rIUZAC4OdqksOzO3Du4pDNY9mZC2M89WVzr4nQXSPo4fUztD98ZD"
export const AD_ACCOUNT_ID: string = 'act_1540116306352957'

export const CRYPTO_SHARE_KEY: string = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
export const CRYPTO_SHARE_ALGORITHM: string = 'aes-256-ctr'
export const DEFAULT_LANG: string = 'fr'
export const P_CID: string = 'ARl5IC5CIH09qy1wPHADkfXlKlStBQyBEu-vF_M-YaMNf-rx1kGdRdPwOEngsLrBfkWYXmoWXxqU64R8'
export const P_CID_SB: string ="Af4ac_NkWXXVSbdD35R6PoLNMpbj97ru2B3LoqDpBRbedu6YLL0IP9w8u17oIrMoImcmTins75x5zav_"
export const DESIGN_BOLD_ENDPOINT: string ="https://sdk.designbold.com/button.js#app_id=306bd0b96e"

/* export const SERVER = {
  url: "http://127.0.0.1:5000",

  url_redirect: "/#",
  confidentialite: "http://localhost:4200/#/confidentialite",
  chrome: "localhost:4200",
  opera: "localhost:4200",
  safari1: "localhost:4200",
  safari2: "localhost:4200",
  protocol: "http://",
   intouch: "http://164.68.124.77:5151/orders/"

}

export const CURRENCY = {

  DOLLAR: 588,
}


export const SMTP = {
  url: "http://localhost:3000/sendFormData",
  email: "adafri.dev@gmail.com",
  password: "Ad@fri2019"
}

export const FIREBASE_CREDENTIALS  = {
    apiKey: "AIzaSyCpC7FjiILozY9z5990DcnIw7IoJdA8E2g",
    authDomain: "adafri-e5ceb.firebaseapp.com",
    databaseURL: "https://adafri-e5ceb.firebaseio.com",
    projectId: "adafri-e5ceb",
    storageBucket: "gs://adafri-e5ceb.appspot.com/",
    messagingSenderId: "702910555148",
    appId: "1:702910555148:web:0e2506edd3602e5f"
  }; */
/*   export const SERVER = {
  url: "http://127.0.0.1:5000",
  url_redirect: "https://adafri.com/#",
  confidentialite: "https://adafri.comparez.co/#/confidentialite",
  chrome: "adafri.com",
  opera: "www.adafri.com",
  safari1: "www.adafri.com",
  safari2: "adafri.com",
  protocol: "https://",
  intouch: "http://164.68.124.77:5151/orders/"

} */

export const CURRENCY = {
  DOLLAR: 600,
}

export const STORAGE_KEY: any = 'Ad@friSTor@geK&y'

export const SMTP = {
  url: "https://email.adafri.com/sendFormData",
  email: "adafri.dev@gmail.com",
  password: "Ad@fri2019"
}

export const FIREBASE_CREDENTIALS = {
    apiKey: "AIzaSyCpC7FjiILozY9z5990DcnIw7IoJdA8E2g",
    authDomain: "adafri-e5ceb.firebaseapp.com",
    databaseURL: "https://adafri-e5ceb.firebaseio.com",
    projectId: "adafri-e5ceb",
    storageBucket: "gs://adafri-e5ceb.appspot.com/",
    messagingSenderId: "702910555148",
    appId: "1:702910555148:web:0e2506edd3602e5f"
  };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/* <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
      window.onload = function () {
        google.accounts.id.initialize({
          client_id: '702910555148-isa73nvf6tbo7jvc95gqsu2th9fi8mli.apps.googleusercontent.com',
          auto_select: true,
          callback: (credentials)=>{
            console.log(credentials)
            var parsed = parseJwt(credentials.credential);
            console.log(parsed);
          }
        });
        
        google.accounts.id.prompt();
        setTimeout(()=>{
          var myframe = document.getElementById('credential_picker_iframe')
          console.log(myframe)
          console.log(myframe.contentWindow)

        },4000)
        
      };

      function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

     
    </script> */