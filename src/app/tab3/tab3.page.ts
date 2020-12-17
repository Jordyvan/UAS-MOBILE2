import {Component, ElementRef, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AlertController, NavController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {UserServiceService} from '../services/user-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public currUser: any; // temp user
  imageUrl: any; // temp imgurl
  public Dummy: any = [];
  // pressGesture: Gesture;
  uid = localStorage.getItem('UID');
  constructor(
      private el: ElementRef,
      private router: Router, // routing to page
      private authService: AuthService, // auth
      private userService: UserServiceService, // user service
      private toastController: ToastController,
      private alertController: AlertController
  ) {
    this.el.nativeElement;
  }

  ngOnInit() {
    this.getListLocation();
    this.userService.getUser(this.uid).subscribe(res => {
      localStorage.setItem('currUser', JSON.stringify(res));
    });
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if (this.currUser.profileImage == null)
    {
      this.imageUrl = '../../../assets/img/dum.png';
    }
    else
    {
      this.imageUrl = this.currUser.profileImage;
    }
  }

  ionViewWillEnter(){
    // this.getListLocation();
    this.userService.getUser(this.uid).subscribe(res => {
      localStorage.setItem('currUser', JSON.stringify(res));
    });
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if (this.currUser.profileImage == null)
    {
      this.imageUrl = '../../../assets/img/dum.png';
    }
    else
    {
      this.imageUrl = this.currUser.profileImage; // set image user
    }
  }

  logout(){
    let msg: any;
    msg = this.authService.logOut();
    this.presentToast();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async presentAlert(locId) {
    const alert = await this.alertController.create({
      header: 'Delete Feed Location!',
      message: 'Are you sure wan\'t to delete this status?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => this.deleteLocation(locId)
        }
      ]
    });

    await alert.present();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Logout Successful',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
  // GET DATA LOCATION
  getListLocation(){
    const self = this;
    this.userService.getDataLocation().subscribe(data => {
      data.payload.child(this.uid).forEach(function (childSnapshot){
        const tanggal = childSnapshot.key.split('-');
        self.Dummy.push({
          id: childSnapshot.key, // BUAT DELETE BUTUH IDNYA
          date: tanggal[0] + ' ' + tanggal[1] + ' ' + tanggal[2] + ' ' + tanggal[3],
          lat: childSnapshot.child('lat').val(),
          lng: childSnapshot.child('lng').val(),
          nama: childSnapshot.child('nama').val()
        });
      });
    });
  }
  // DELETE LOCATION
  deleteLocation(locId)
  {
    this.userService.deleteDataLocation(locId);
    this.Dummy.forEach((data, index) => {
      if (data.id === locId)
      {
        this.Dummy.splice(index, 1);
      }
    });
  }
  test(locId)
  {
    this.presentAlert(locId);
  }
}
