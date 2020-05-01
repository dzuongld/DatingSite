import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'
import { AuthService } from '../_services/auth.service'
import { AlertifyService } from '../_services/alertify.service'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { User } from '../_models/user'

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter()
    user: User
    registerForm: FormGroup
    bsConfig: Partial<BsDatepickerConfig> // make all properties optional

    constructor(
        private authService: AuthService,
        private alertify: AlertifyService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        // this.registerForm = new FormGroup(
        //     {
        //         username: new FormControl('', Validators.required),
        //         password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        //         confirmPassword: new FormControl('', Validators.required),
        //     },
        //     this.passwordMatchValidator
        // )

        this.bsConfig = Object.assign({}, { containerClass: 'theme-red' })
        this.createRegForm()
    }

    createRegForm() {
        this.registerForm = this.formBuilder.group(
            {
                gender: ['male'],
                username: ['', Validators.required],
                knownAs: ['', Validators.required],
                dateOfBirth: [null, Validators.required],
                city: ['', Validators.required],
                country: ['', Validators.required],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
            },
            {
                validators: this.passwordMatchValidator,
            }
        )
    }

    passwordMatchValidator(g: FormGroup) {
        // should match with 'formControlName'
        return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true }
    }

    register() {
        if (this.registerForm.valid) {
            this.user = Object.assign({}, this.registerForm.value)
            this.authService.register(this.user).subscribe(
                () => {
                    this.alertify.success('Register successful')
                },
                (error) => {
                    this.alertify.error(error)
                },
                () => {
                    // auto login after successfull registration
                    this.authService.login(this.user).subscribe(() => {
                        this.router.navigate(['/members'])
                    })
                }
            )
        }
    }

    cancel() {
        this.cancelRegister.emit(false)
    }
}
