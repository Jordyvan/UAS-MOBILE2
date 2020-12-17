import { variable } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  // DB PATH
  private dbPath = '/user/';
  private dbFriendPath = '/friend/';
  private dbLocPath = '/Location/';

  // REF
  userRef: AngularFireList<User> = null;
  friendRef: AngularFireList<any> = null;
  LocRef: AngularFireList<any> = null;
  // GET USER ID
  private currUserId = localStorage.getItem('UID');

  constructor(
      private db: AngularFireDatabase,
      private storage: AngularFireStorage
  ) {
    this.userRef = db.list(this.dbPath);
    this.friendRef = db.list(this.dbFriendPath + this.currUserId);
    this.LocRef = db.list(this.dbLocPath + this.currUserId);
  }
  //  GET ALL USER
  getAllUser(): AngularFireList<User>{
    return this.userRef;
  }
  // CREATE NEW USER
  newUser(user: {nama: string; email: string; }, uid): any{
    console.log(user);
    return this.db.object(this.dbPath + uid).set({
      nama: user.nama,
      email: user.email
    });
  }
  //  GET USER
  getUser(uid){
    return this.db.object(this.dbPath + uid).valueChanges();
  }
  //  UPDATE USER
  updateUser(name, uid, uploadImage)
  {
    //  update with upload image
    if (uploadImage){
      this.storage.ref(this.dbPath + uid + '/profileImage/').getDownloadURL().subscribe(res => {
        this.db.object(this.dbPath + uid).update({nama: name, profileImage: res});
      });
    }else{
      //  update without upload image
      this.db.object(this.dbPath + uid).update({nama: name});
    }
  }
  // UPLOAD PROFILE IMG
  uploadProfileImage(imageData, uid)
  {
    return this.storage.ref(this.dbPath + uid + '/profileImage/').putString(imageData, 'data_url');
  }
  //  GET ALL FRIEND FROM FIREDB
  getAllFriend(){
    return this.db.object(this.dbFriendPath).snapshotChanges();
  }
  //  ADD FRIEND TO FIREDB
  addFriend(data){
    this.db.object(this.dbFriendPath + this.currUserId).update({[data] : true});
  }
  //  DELETE FRIEND FROM FIRE DB
  deleteFriend(nama){
    this.db.object(this.dbFriendPath + this.currUserId).update({[nama]: null});
    // this.db.object(this.dbFriendPath).snapshotChanges().subscribe(data =>{
    //   data.payload.child(this.currUserId).child(nama)
    // })
  }
  //  UPDATE LOCATION TO FIRE DB
  updateLocation(newLocation){
    //  STORE VARIABLE FROM NEWLOCATION
    const lat = Object.values(newLocation)[0].toString();
    const lng = Object.values(newLocation)[1].toString();
    const nama = Object.values(newLocation)[2].toString();
    const date: string = Object.values(newLocation)[3].toString();
    this.db.object(this.dbLocPath + this.currUserId).update({
      //  [date] MAKE VARIABLE DYNAMIC
      [date]: {
        lat : lat,
        lng : lng,
        nama: nama
      }
    });
  }
  //  GET DATA LOCATION FROM FIRE DB
  getDataLocation(){
    return this.db.object(this.dbLocPath).snapshotChanges();
  }
  deleteDataLocation(idLocation){
    console.log('dari userservice delete loc: ' + idLocation);
    this.db.object(this.dbLocPath + this.currUserId).update({
      [idLocation]: null

    });
  }

}
