import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Upload, UploadResponsiveDisplay} from '../models/upload.models'
import { map } from 'rxjs/operators';
import 'firebase/storage';
@Injectable()
export class UploadService {

  constructor(private afs: AngularFirestore) { }

  private basePath: string = '/uploads';
  uploads: AngularFirestoreCollection<Upload>;
  private uploadModel: Upload;
  public value_replace: string = ""
  public metadata: any;
  public extension: string = ""

  getValueReplace(src: string): Promise<string> {
    return new Promise(resolve => {

     
      if (src.includes('data:image/png;base64,')) {
        this.value_replace = "data:image/png;base64,"
        this.metadata = {
          contentType: 'image/png',
        };
        this.extension = "png"
        resolve('ok')
      } else if (src.includes('data:image/jpeg;base64')) {
        //console.log(true)
        this.value_replace = "data:image/jpeg;base64,"
        this.metadata = {
          contentType: 'image/jpeg',
        };
        this.extension = "jpg"
        resolve("ok")
     
      } else if (src.includes('data:image/gif;base64')) {
        this.value_replace = "data:image/gif;base64,"
        this.metadata = {
          contentType: 'image/gif',
        };
        this.extension = "gif"
        resolve("ok")
      }
    })
  }
  pushUpload(uid: string, name: string, width: number, height: number, src: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      
      this.getValueReplace(src).then(res_replace => {
    
        if (res_replace === "ok") {
           imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          //console.log(this.value_replace)
          //console.log(src.replace(this.value_replace, ''))
        
            
          let uploadTask = storageRef.child(imageRefStorage).putString(src.replace(this.value_replace, ''), 'base64', this.metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              console.log(snapshot)
              // upload in progress
              /*  upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 */
            },
            (error) => {
              console.log(error)
              // upload failed
              //console.log(error)
            },
            () => {
              // upload success
        
              firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function (event) {
                  var blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();

                const image_content = "";
                this.createUpload(uid, name, imageRefStorage, width, height, url, src).then(res_create => {
                  //console.log(res_create)
                  if (res_create === "ok") {
                    //console.log(url)
                    this.value_replace = ""
                    this.metadata = {}
                    this.extension = ""
                    resolve('ok')
                  }
                })

              })
  
            })
        }
      })
    
    })

  }

  uploadImage(uid: string, name: string, src: string):Promise<string> {
     return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      
      this.getValueReplace(src).then(res_replace => {
        if(res_replace === "ok") {
          imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          let uploadTask = storageRef.child(imageRefStorage).putString(src.replace(this.value_replace, ''), 'base64', this.metadata);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              // upload in progress
              /*  upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 */
            },
            (error) => {
              // upload failed
              //console.log(error)
              resolve('error')
            },
            () => {
              firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function (event) {
                  var blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                resolve(url)
              })
  
            })
        }
      })
    
    })
  }

  pushUploadResponsiveDisplay(uid: string, name: string, width: number, height: number, image_json: string, src: string, description: string, brand: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      
      this.getValueReplace(src).then(res_replace => {
    
        if (res_replace === "ok") {
          imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          //console.log(this.value_replace)
          //console.log(src)
          //console.log(src.replace(this.value_replace, ''))
        
            
          let uploadTask = storageRef.child(imageRefStorage).putString(src.replace(this.value_replace, ''), 'base64', this.metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
      
              // upload in progress
              /*  upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 */
            },
            (error) => {
              // upload failed
              //console.log(error)
            },
            () => {
              // upload success
        
              firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function (event) {
                  var blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();

                const image_content = "";
                this.createUploadResponsiveDisplay(uid, name, imageRefStorage, width, height, url, image_json, src, description, brand).then(res_create => {
                  //console.log(res_create)
                  if (res_create === "ok") {
                    //console.log(url)
                    this.value_replace = ""
                    this.metadata = {}
                    this.extension = ""
                    resolve('ok')
                  }
                })

              })
  
            })
        }
      })
    
    })

  }
  sendRectangleImage(uid: string, imageRectangle: string, name: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      this.getValueReplace(imageRectangle).then(res_replace => {
        if (res_replace === "ok") {
           imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          let uploadTask = storageRef.child(imageRefStorage).putString(imageRectangle.replace(this.value_replace, ''), 'base64', this.metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => { 

            },
             
              () => {
                firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                  var xhr = new XMLHttpRequest();
                  xhr.responseType = 'blob';
                  xhr.onload = function (event) {
                    var blob = xhr.response;
                  };
                  xhr.open('GET', url);
                  xhr.send();
                  resolve(url)
                }).catch((e) => {
                  resolve('error')
                })
  
              })
        }
      
    })
  })
  }
    sendSquareImage(uid: string, imageSquare: string, name: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      this.getValueReplace(imageSquare).then(res_replace => {
        if (res_replace === "ok") {
           imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          let uploadTask = storageRef.child(imageRefStorage).putString(imageSquare.replace(this.value_replace, ''), 'base64', this.metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => { 

            },
             
              () => {
                firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                  var xhr = new XMLHttpRequest();
                  xhr.responseType = 'blob';
                  xhr.onload = function (event) {
                    var blob = xhr.response;
                  };
                  xhr.open('GET', url);
                  xhr.send();
                  resolve(url)
                }).catch((e) => {
                  resolve('error')
                })
  
              })
        }
      
    })
  })
  }
    sendLogoImage(uid: string, imageLogo: string, name: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      this.getValueReplace(imageLogo).then(res_replace => {
        if (res_replace === "ok") {
  imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          let uploadTask = storageRef.child(imageRefStorage).putString(imageLogo.replace(this.value_replace, ''), 'base64', this.metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => { 

            },
             
              () => {
                firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                  var xhr = new XMLHttpRequest();
                  xhr.responseType = 'blob';
                  xhr.onload = function (event) {
                    var blob = xhr.response;
                  };
                  xhr.open('GET', url);
                  xhr.send();
                  resolve(url)
                }).catch((e) => {
                  resolve('error')
                })
  
              })
        }
      
    })
  })
}

   sendDisplayImage(uid: string, image: string, name: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      let imageRefStorage = ""
      this.getValueReplace(image).then(res_replace => {
        if (res_replace === "ok") {
          imageRefStorage = "/uploads/" +uid +"/" + uid + " " + name + new Date().getTime().toString() +"." +this.extension
          let uploadTask = storageRef.child(imageRefStorage).putString(image.replace(this.value_replace, ''), 'base64', this.metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => { 

            },
             
              () => {
                firebase.storage().ref().child(imageRefStorage).getDownloadURL().then(url => {
                  var xhr = new XMLHttpRequest();
                  xhr.responseType = 'blob';
                  xhr.onload = function (event) {
                    var blob = xhr.response;
                  };
                  xhr.open('GET', url);
                  xhr.send();
                  resolve(url)
                }).catch((e) => {
                  resolve('error')
                })
  
              })
        }
      
    })
  })
}


     sendUploadResponsiveDiplayUrl(uid: string, name: string, width: number, height: number,  rectangleJson: string, squareJson: string, logoJson: string,  rectangleImage: string, squareImage: string, logoImage: string, description: string, brand: string): Promise<string> {
    return new Promise(resolve => {
      
    
    })

  }
  
  public getListUploads(uid: string) {  
    return this.afs.collection<Upload>('uploads', (ref) => ref.where('owner', '==', `${uid}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }

   public getListUploadsResponsiveDisplay(uid: string) {
    return this.afs.collection<UploadResponsiveDisplay>('uploads-responsive-display', (ref) => ref.where('owner', '==', `${uid}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
    
  }


  createUpload(uid: string, name: string, image_ref: string, width: number, height: number, image_url: any, src: string): Promise<string> {
    return new Promise(resolve => {
      var uploads = []
    
      var new_upload = {
         name: name,
      image_ref: image_ref,
      src: src,
      width: width,
      height: height,
      image_url: image_url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      owner: uid,
      }

      var json = localStorage.getItem("uploads");
if (json) {
    uploads = JSON.parse(json);
} else {
    uploads = [];
}
uploads.push(new_upload);
localStorage.setItem("uploads", JSON.stringify(uploads));
    resolve('ok')
    /*   this.uploadModel = this.prepareSaveUpload(uid, name, image_ref, width, height, image_url, src);
      this.afs.collection('uploads').add(this.uploadModel)
        .then((value) => {
          if (value) {
            resolve('ok')
          
        }
      }) */
    })
  }

  createUploadResponsiveDisplay(uid: string, name: string, image_ref: string, width: number, height: number, image_url: any, image_json: any, src: string, description: string, brand: string): Promise<string> {
    return new Promise(resolve => {
        let responsives_uploads = []
      var new_upload = {
      name: name,
      image_ref: image_ref,
      src: src,
      width: width,
      height: height,
      image_json: image_json,
      description: description,
      brand: brand,
      image_url: image_url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      owner: uid,
      }
       var json = localStorage.getItem("responsives-uploads");
if (json) {
    responsives_uploads = JSON.parse(json);
} else {
    responsives_uploads = [];
}
responsives_uploads.push(new_upload);
localStorage.setItem("responsives-uploads", JSON.stringify(responsives_uploads));
    resolve('ok')
      
   /*    this.uploadModel = this.prepareSaveUploadResponsiveDisplay(uid, name, image_ref, width, height, image_url, image_json, src, description, brand);
      this.afs.collection('uploads-responsive-display').add(this.uploadModel).then((value) => {
        if (value) {
          
          resolve('ok')
          
        }
      }); */
    })
  }

  prepareSaveUpload(uid: string, name: string, image_ref: string, width: number, height: number, image_url: any, src: string): Upload {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newUpload = {
      name: name,
      image_ref: image_ref,
      src: src,
      width: width,
      height: height,
      image_url: image_url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,
    };
    return { ...newUpload };
  }
    prepareSaveUploadResponsiveDisplay(uid: string, name: string, image_ref: string, width: number, height: number, image_url: any, image_json: any, src: string, description: string, brand: string): UploadResponsiveDisplay {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newUpload = {
      name: name,
      image_ref: image_ref,
      src: src,
      width: width,
      height: height,
      image_json: image_json,
      description: description,
      brand: brand,
      image_url: image_url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,
    };
    return { ...newUpload };
  }



  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.afs.collection('uploads').add(upload)
    
  }

  getUpload(id: string) {
    return this.afs.doc<any>(`uploads/${id}`);
  }

  deleteUpload(id: string, ref: string) {
    this.deleteFileData(id)
      .then(() => {
        this.deleteFileStorage(ref)
      })
      .catch(error => { }//console.log(error))
      )
  }

  // Deletes the file details from the realtime db
  deleteFileData(id: string): Promise<string> {
    return new Promise(resolve => {
      this.getUpload(id).delete()
      resolve('ok')
      
    })
   
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  deleteFileStorage(ref: string): Promise<string> {
    return new Promise(resolve => {
      let storageRef = firebase.storage().ref();
      storageRef.child(ref).delete()
      resolve('ok')
    })

   
  }
}
