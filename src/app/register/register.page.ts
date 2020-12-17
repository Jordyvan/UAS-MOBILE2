import { Component, OnInit } from '@angular/core';
import {User} from '../model/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {AuthService} from '../services/auth.service';
import {UserServiceService} from '../services/user-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validationForm: FormGroup;
  errorMessage: string;
  errorMsg: string;
  email: any = [];
  newU: User;

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.'}
    ],
    password1: [
      { type: 'required', message: 'Password is required.'},
      { type: 'minlength', message: 'Password must be at least 6 characters long.'}
    ],
    password2: [
      { type: 'required', message: 'Password is required.'},
      { type: 'minlength', message: 'Password must be at least 6 characters long.'}
    ],
    Fname: [
      { type: 'required', message: 'First Name is required.'},
    ],
    Lname: [
      { type: 'required', message: 'Last Name is required.'},
    ]
  };

  constructor(
      private nav: NavController,
      private auth: AuthService,
      private formBuilder: FormBuilder,
      private loading: LoadingController,
      private storage: Storage,
      private userService: UserServiceService,
      private toastController: ToastController,
      private loadingController: LoadingController,
      private router: Router,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('currUser')){
      this.router.navigate(['/tabs']);
    }
    this.errorMessage = '';
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')
      ])),
      password1: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      password2: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      Fname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      Lname: new FormControl('', Validators.compose([
        Validators.required
      ])),


    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Memproses akun...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  async toastSentEmail(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: 'danger',
      duration: 2500
    });
    toast.present();
  }

  tryRegister(value){
    console.log(value);
    if (value.password1 === value.password2){
      this.auth.signUpWithEmail(value.email, value.password1)
          .then((resp) => {
            resp.user.sendEmailVerification()
                .then(() => {
                  this.auth.setMessage('Email verifikasi telah dikirim');
                  // SEND USER DATA TO DB
                  const userData = {
                    nama: value.Fname + ' ' + value.Lname,
                    email: value.email
                  };
                  this.userService.newUser(userData, resp.user.uid)
                      .then(res => {
                        console.log(res);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  this.validationForm.reset();
                  this.presentLoading().then(() => {
                    this.router.navigate(['./login']);
                    this.toastSentEmail('Email verifikasi sudah dikirim');
                  });
                })
                .catch(err => {
                  console.log(err);
                });

          })
          .catch(err => {
            this.errorMsg = err.message;
          });
    }else {
      return this.toastSentEmail('Password and Confirm Password doesn\'t match');
      this.errorMessage = 'Password dont match';
    }
  }
  goLoginPage(){
    this.nav.navigateForward('/login');
  }

}
