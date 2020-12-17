import { Component } from '@angular/core';
import {UserServiceService} from '../services/user-service.service';
import {LoadingController, ModalController, NavController} from '@ionic/angular';
import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public tempFriendList: any = [];
  public backupFriend = [];
  tempUser: any;
  Dummy: any;
  searching: any = false;
  public searchControl: FormControl;
  currUser: string = JSON.parse(localStorage.getItem('currUser'));
  currUserId: string = localStorage.getItem('UID');
  constructor(

      private modalCtrl: ModalController,
      private navCtrl: NavController,
      private userService: UserServiceService,
      private loadingController: LoadingController
  ) {
  }

  ionViewWillEnter(){
    this.tempFriendList.splice(0, this.tempFriendList.length);
    const self = this;

    this.userService.getAllUser().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data1 => {
      for (let i = 0; i < data1.length; i++)
      {
        if (data1[i].key === this.currUserId)
        {
          data1.splice(i, 1);
        }
      }
      self.tempUser = data1;
      this.userService.getAllFriend().subscribe(data => {
        self.Dummy = self.tempUser;
        data.payload.child(this.currUserId).forEach(function (childSnapshot) {
          for (let i = 0; i < self.Dummy.length; i++)
          {
            if (childSnapshot.key === self.Dummy[i].key)
            {
              self.tempFriendList.push(self.Dummy[i]);
            }
          }
        });
        this.backupFriend = this.tempFriendList;
      });
    });

    this.presentLoading();
  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading Data',
      duration: 1000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
  navAddPage(){
    this.navCtrl.navigateForward('/addfriend');
  }
  delete(nama: string){
    const self = this;
    this.userService.deleteFriend(nama);
    let index: number;
    index = this.tempFriendList.forEach((element, index) => {
      if (element === nama)
      {

        return index;
      }
    });
    self.tempFriendList.splice(index, this.tempFriendList.length);
    this.tempFriendList = self.tempFriendList;
  }
  onChange(event)
  {
    const filteration = event.target.value;
    this.tempFriendList = this.filterItems(filteration);
    // console.log(this.tempFriendList)
    if (filteration.length === 0) {
      this.tempFriendList = this.backupFriend;
    }
  }
  filterItems(searchTerm){
    return this.backupFriend.filter(item => {
      // console.log(item.toLowerCase().indexOf(searchTerm))
      return item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
