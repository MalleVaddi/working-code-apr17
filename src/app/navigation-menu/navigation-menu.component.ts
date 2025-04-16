import { Component } from '@angular/core';
import{MatMenuModule} from '@angular/material/menu';
import{ MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  imports: [MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.css'
})
export class NavigationMenuComponent {

}
