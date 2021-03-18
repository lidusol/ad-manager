import { map, take, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import isURL from 'is-url'



/* export function usernameValidator(auth: AuthService) {
   
  return (control: AbstractControl): { [key: string]: any } | null => {
  
      auth.getUsername(control.value).then(res => {
        console.log(res.length)
        if (res.length === 1) {
          return { unvaible: true }
        } else {
          return null
        }
      })
      return;
        
    }
  } */
    


 export function usernameValidator(afs: AngularFirestore) {
  return (control: AbstractControl) : { [key: string]: any } | null =>{
    const username = control.value;
    console.log(username)
    return afs.collection('users', (ref) => ref.where('displayName', '==', username)).valueChanges().pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length ? { 'usernameAvailable': true } : null),
    )
  }; 
 
    }
export class FormValidators {

/*   static usernameValidator(auth: AuthService) {
    return (control: AbstractControl) => {
      auth.getUsername(control.value).then(res => {
        console.log(res.length)
        if (res.length === 1) {
          return { unvaible: true }
        } else {
          return null
        }
      })
        
    }
      } */
 
     static emailValidator(afs: AngularFirestore) {
          return (control: AbstractControl): { [key: string]: any } | null => {
             const email = control.value;
    return afs.collection('users', (ref) => ref.where('email', '==', email)).valueChanges().pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length ? { emailAvailable: true } : null ),
    ) 
    };
 
     }
   static traceCampaigneNameValidator(afs: AngularFirestore) {
          return (control: AbstractControl): { [key: string]: any } | null => {
             const name = control.value;
    return afs.collection('trace', (ref) => ref.where('name', '==', name)).valueChanges().pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length ? { nameAvailable: true } : null ),
    ) 
    };
 
  }
  static displayCampaignNameValidator(afs: AngularFirestore, uid: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let name = control.value;
     
      return afs.collection('adwords-display', (ref) => ref.where('name', '==', name).where('owner', '==', uid)).valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length ? { nameAvailable: true } : null),
      )
    };
  }

  static youtubeCampaignNameValidator(afs: AngularFirestore) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const name = control.value;
      return afs.collection('youtube-ads', (ref) => ref.where('name', '==', name)).valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length ? { nameAvailable: true } : null),
      )
    };
  }

  static validLandingPageUrlValidator(control) {
    if (!control.value.startsWith('https') || !control.value.startsWith('http') || !control.value.includes('.io') || !control.value.includes('.com') || !control.value.includes('.fr') || !control.value.includes('.sn') || !control.value.includes('.eu') || !control.value.includes('.en') || !control.value.includes('.co')) {
            
    return { validUrl: true };
  }
  return null;
 
  }

}

export function urlValidator(control: AbstractControl) {
  return null;
  //  var regexp =  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  //       if (regexp.test(control.value))
  //       {
  //         return null;
  //       }
  //       else
  //       {
  //         return {urlValid: false};
  //       }
}

declare const require: any;
const blackListShortner: any[] = ['clk.im', 'bit.ly', 'j.mp', 'goo.gl', 'tiny.cc', 'i.gd', 'soo.gd', 'ow.ly', 'cutt.ly', 'tinyurl.com', 'web.whatsapp.com', 'facebook.com','www.facebook.com', 'www.google.com', '.exe', '.dmg', '.apk']


export function  urlDomainValidator(control: AbstractControl) {
  var parse = require('url-parse')
    , url = parse(control.value, true);
  if (blackListShortner.includes(url.host)) {
    return {urlValid: false};
  } else{
    return null
  }

  


}

export function urlSchemeValidator(control: AbstractControl) {
  var parse = require('url-parse')
    , url = parse(control.value, true);
  var is_url: boolean = isURL(control.value.toString().replace(/\s*$/, ""))
  

  if (control.value.toString().startsWith('http://') || control.value.toString().startsWith('https://')) {
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      if (is_url) {
        
        return null
      } else {
         return {urlValid: false};
      }
  } else {
    return {urlValid: false};
  }
  } else {
    return {urlValid: false};
  }
  
 
 

}

export function dateValidator(control: AbstractControl) {

  if (control.value !== null) {
    if (new Date(new Date(control.value[0]).setHours(0,0,0,0)).getTime() < new Date(new Date().setHours(0,0,0,0)).getTime()) {
       return {dateValid: false}
    } else{
      return null
    }
  
  } else{
    return {dateValid: false}
  }
  
 
 

}

export function dateValidatorExpress(control: AbstractControl) {

  if (control.value !== null) {
    if (new Date(new Date(control.value).setHours(0, 0, 0, 0)).getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()) {
      return { dateValid: false }
    } else {
      return null
    }
  
  } else {
    return { dateValid: false }
  }
}

export function budgetValueValidator(control: AbstractControl) {
  var budget = control.value
  if (budget > 0) {
    var divider: number = 50;
    if (budget % divider === 0) { 
      return null
    } else {
      while (budget % divider !== 0) {
            budget++;
      }
      return {suggested: budget}
    }
  }
  var parse = require('url-parse')
    , url = parse(control.value, true);
  if (blackListShortner.includes(url.host)) {
    return {urlValid: false};
  } else{
    return null
  }

  


}