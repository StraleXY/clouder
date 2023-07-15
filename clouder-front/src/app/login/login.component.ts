import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(private authService: AuthService, private router: Router) {}

    isSignIn: boolean = true
    isVerification: boolean = false
    verificationEmail: string = ''
    verificationCode: string = ''

    toggleSignUp() {
        this.isSignIn = !this.isSignIn
        this.clearAuthForm()
    }

    toggleVerification() {
        if (!this.isSignIn) this.toggleSignUp()
        this.clearAuthForm()
        this.isVerification = !this.isVerification
    }

    authForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        surname: new FormControl(''),
        birthdate: new FormControl(''),
        familyMemberEmail: new FormControl(''),
        email: new FormControl('',  [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern("^.{8,}$")])
    })

    clearAuthForm() {
        this.authForm.setValue({
            'name': '',
            'surname': '',
            'birthdate': '',
            'familyMemberEmail': '',
            'email': '',
            'password': ''
        })
    }

    onSubmit(e: Event) {
        e.preventDefault();
        if (this.isSignIn) this.login()
        else this.register()
    }

    login() {
        this.authService.login(this.authForm.value.email, this.authForm.value.password).then((res) => {
            this.router.navigate(['/home']);
            console.log("USPEO LOGIN")
            console.log(res)
            localStorage.setItem('token', res.signInUserSession.idToken.jwtToken)
        }).catch((err) => {
            console.log(err)
        })
    }

    register() {

        let familyMemberEmail = this.authForm.value.familyMemberEmail;
        
        if (familyMemberEmail){
            this.authService.registerFamilyMember(
                this.authForm.value.email,
                this.authForm.value.password,
                this.authForm.value.name + " " + this.authForm.value.surname,
                this.authForm.value.birthdate,
                familyMemberEmail
            ).then((res) => {
                this.verificationEmail = this.authForm.value.email
                this.toggleVerification()
                console.log("USPEO REGISTER FAMILY MEMBER")
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        } else {
            this.authService.register(
                this.authForm.value.email,
                this.authForm.value.password,
                this.authForm.value.name + " " + this.authForm.value.surname,
                this.authForm.value.birthdate
            ).then((res) => {
                this.verificationEmail = this.authForm.value.email
                this.toggleVerification()
                console.log("USPEO REGISTER")
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    verify() {
        this.authService.verifyAccount(
            this.verificationEmail,
            this.verificationCode
        ).then((res) => {
            console.log("USPEO VERIFY")
            console.log(res)
            this.toggleVerification()
        }).catch((err) => {
            console.log(err)
        })
    }
}
