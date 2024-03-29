

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
}

export interface CustomerFormResult extends FormResult {
    customer_name: string;
}

export interface OperatorFormResult extends FormResult {
    operator_name: string;
    operator_email: string;
}

export interface RFOFormResult extends FormResult {

}

export interface FormProps<T extends FormResult> {
    onSubmit: (results: T, id?: string) => Promise<any>;
    defaultValues?: T;
}