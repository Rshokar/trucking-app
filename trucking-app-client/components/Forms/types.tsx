

export interface FormResult { }

export interface LoginFormResult extends FormResult {
    email: string,
    password: string
}

export interface FormProps<T extends FormResult> {
    onSubmit: (results: T) => any;
}