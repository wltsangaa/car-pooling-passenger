import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.checkUser();
  }

  signupUser(user): Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(user['email'], user['password'])
      .then(response => {
        const uid = response.user.uid;
        return this.db
          .collection('customers')
          .doc(uid)
          .set({
            name: `${user['first_name']} ${user['last_name']}`,
            email: user['email'],
            phone: `${user['area']}-${user['phone']}`
          });
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  checkUser() {
    this.afAuth.auth.onAuthStateChanged(user => {
      this.user.next(user);
    });
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  getUser(uid) {
    const docRef = this.db.collection('customers').doc(uid).ref;
    return new Promise(resolve => {
      const data = docRef.get().then(doc => {
        console.log(doc.data());
        resolve(doc.data());
      }).catch((e) => {
        console.log('error getting document',e);
        resolve(e);
      })
    });
  }
}
