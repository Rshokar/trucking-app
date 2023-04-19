

export interface FormResult { }

export interface LoginFormResult extends FormResult {
    email: string,
    password: string
}

export interface RegisterFormResult extends FormResult {
    email: string,
    password: string,
    confirmPassword: string,
    company: string,
    acType: 'dispatcher' | 'operator'
}

export interface FormProps<T extends FormResult> {
    onSubmit: (results: T) => any;
}