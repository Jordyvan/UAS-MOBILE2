import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import {Platform, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  imageUrl: any;
  isDesktop: boolean;
  photo: SafeResourceUrl;
  constructor(
      private popOverController: PopoverController,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      private sanitizerImpl: ɵDomSanitizerImpl
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) ||
        this.platform.is('desktop')){
      this.isDesktop = true;
    }
  }

  async getPicture(type: string){
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));

    this.imageUrl = this.sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, this.photo);

    this.popOverController.dismiss(this.imageUrl);
  }

  onFileChoose(event: Event)
  {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)){
      console.log('file format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);

  }
}
