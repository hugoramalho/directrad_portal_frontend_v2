// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// // import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username = '';
//   password = '';

//   constructor(private authService: AuthService, private router: Router) { }

//   onLogin() {
//     const userType = this.authService.login(this.username, this.password);

//     if (userType === 'admin') {
//       this.router.navigate(['/admin']);
//     } else if (userType === 'cliente') {
//       this.router.navigate(['/cliente']);
//     } else {
//       alert('Credenciais inválidas!');
//     }
//   }
// }