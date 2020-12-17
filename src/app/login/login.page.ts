import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validationForm: FormGroup;
  logged = false;
  errorMessage: string = '';
  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.'}
    ],
    password: [
      { type: 'required', message: 'Password is required.'},
      { type: 'minlength', message: 'Password must be at least 6 characters long.'}
    ]
  };

  constructor(private nav: NavController,
              private auth: AuthService,
              private storage: Storage,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private toastController: ToastController,
              private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('currUser')){
      this.router.navigate(['/tabs']);
    }
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  loginUser(value) {
    this.auth.signInWithEmail(value.email, value.password)
        .then(res => {
          if (res.user.emailVerified){
            this.auth.setUserSession(res.user.uid);
          }
          else{
            this.toastNotif('Email belum terverifikasi');
          }
        })
        .catch(err => {
          this.toastNotif('Invalid user credentials, please try again');
        });
  }

  async toastNotif(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  goToRegisterPage(){
    this.nav.navigateForward('/register');
  }

}
