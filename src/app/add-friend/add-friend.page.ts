import { Component, OnInit } from '@angular/core';
import {UserServiceService} from '../services/user-service.service';
import {LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {
  // BUAT HARDCODE FRIEND
  tempArray = [
    {
      id: 0,
      nama: 'Djasen'
    },
    {
      id: 1,
      nama: 'Bobby'
    },
    {
      id: 2,
      nama: 'Sam'
    },
    {
      id: 3,
      nama: 'Akew'
    },
    {
      id: 4,
      nama: 'aldi'
    },
    {
      id: 5,
      nama: 'Yuan'
    },
    {
      id: 6,
      nama: 'Muhammad'
    },
    {
      id: 7,
      nama: 'Fadhel'
    },
    {
      id: 8,
      nama: 'Tri'
    },
  ];
  tempUser: any;
  temp: any = [];
  tempFriend: any;
  public Dummy = [];
  public backupDummy = [];
  currUser: string = JSON.parse(localStorage.getItem('currUser'));
  currUserId: string = localStorage.getItem('UID');
  constructor(
      private modalCtrl: ModalController,
      private navCtrl: NavController,
      private toastController: ToastController,
      private authService: AuthService,
      private userService: UserServiceService,
      private loadingController: LoadingController
  ) {
  }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.temp.splice(0, this.temp.length);
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
              self.Dummy.splice(i, 1);
            }
          }
        });
        console.log(self.Dummy);
        // NYIMPEN DATA DUMMY YANG UDAH KE FILTER KE DALEM BACKUPDUMMY
        self.backupDummy = self.Dummy;
      });
    });

    this.presentLoading();
  }
  navBacktoFriendList(){
    this.navCtrl.navigateBack('/tabs/t/friend');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading Data',
      duration: 1000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  add(friendId){
    this.Dummy.forEach((data, index) => {
      if (data.key === friendId)
      {
        this.presentToast(data.nama);
        this.userService.addFriend(data.key);
        this.Dummy.splice(index, 1);
        return true;
      }
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg + ' has been added',
      duration: 2000
    });
    toast.present();
  }
  // NAVBACK TO FRIEND PAGE
  navback(){
    this.navCtrl.navigateBack('/tabs/t/friend');
  }
  // REALTIME SEARCH BAR FUNCTION
  onChange(event)
  {
    const filteration = event.target.value;
    this.Dummy = this.filterItems(filteration);
    if (filteration.length === 0) {
      this.Dummy = this.backupDummy;
    }
  }
  // FILTER ITEMS
  filterItems(searchTerm){
    return this.backupDummy.filter(item => {
      return item.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
