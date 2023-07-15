import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
        Amplify.configure({
            Auth: environment.cognito
        });
    }

    login(email: string, password: string) : Promise<any> {
        return Auth.signIn(email, password);
    }

    logout() : Promise<any> {
        localStorage.setItem('email', '');
        return Auth.signOut();
    }

    register(email: string, password: string, name: string, birthdate: string) : Promise<any> {
        return Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: name,
                birthdate: birthdate
            }
        });
    }

    registerFamilyMember(email: string, password: string, name: string, birthdate: string, familyMemberEmail: string) : Promise<any> {
        return Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: name,
                birthdate: birthdate,
                'custom:familyMemberEmail': familyMemberEmail
            }
        });
    }

    verifyFamilyMember(token: string) : Observable<any> {
        let params : HttpParams = new HttpParams();
        params = params.set('token', token);
        return this.http.get(environment.apiHost + 'family/verify', {params});
    }

    verifyAccount(email: string, code: string) : Promise<any> {
        return Auth.confirmSignUp(email, code);
    }

    getCurrentUser() : Promise<any> {
        return Auth.currentUserInfo();
    }
}
