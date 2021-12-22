import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any = SocialUser;
  loggedIn: boolean =true;
  constructor(public _userService: UserService, private authService: SocialAuthService,) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      
      this.loggedIn = (user != null);
    });
  }
}
