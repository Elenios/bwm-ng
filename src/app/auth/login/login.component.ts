import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors: any = [];
  notifyMessage = '';

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe((params) => {
      console.log(params);
      if (params['registered'] === 'true') {
        this.notifyMessage = 'You have registered, please log in!';
      }
    });
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,
                   Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    });
  }

  isInvalidInput(field): boolean {
    return this.loginForm.controls[field].invalid &&
          (this.loginForm.controls[field].dirty || this.loginForm.controls[field].touched);
  }

  isRequired(field): boolean {
    return this.loginForm.controls[field].errors.required;
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/rentals']);
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;
      }
    );
  }

}
