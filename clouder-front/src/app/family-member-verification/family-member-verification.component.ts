import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-family-member-verification',
  templateUrl: './family-member-verification.component.html',
  styleUrls: ['./family-member-verification.component.css']
})
export class FamilyMemberVerificationComponent {

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  message: String = "Verifying family member...";

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        let token = params['token'];
        this.authService.verifyFamilyMember(token).subscribe({
          next: res => {this.message = "Verification successful!"},
          error: e => {this.message = "Verification failed!"}
        });
      }
    );
  }
}
