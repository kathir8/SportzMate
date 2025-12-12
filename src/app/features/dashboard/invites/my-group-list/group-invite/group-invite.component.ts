import { Component, inject, input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { IonicVirtualScrollComponent } from 'src/app/shared/components/ionic-virtual-scroll/ionic-virtual-scroll.component';
import { MateBasicComponent } from '../../../home/mate-stuff/mate-basic/mate-basic.component';
import { MyInvites } from '../../models/invite.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
  imports: [IonContent, IonicVirtualScrollComponent, MateBasicComponent]
})
export class GroupInviteComponent {

  private route = inject(ActivatedRoute);

  responseList = input<MyInvites[]>([]);

  constructor() { }


  ngOnInit() {
    console.log("group-invite");
    
    const idParam = this.route.snapshot.paramMap.get('id');
  

  }

  acceptReject(){

  }

}
