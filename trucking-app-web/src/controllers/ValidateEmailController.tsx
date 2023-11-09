

class ValidateEmailController {


    static async validateDispatcherEmail(token: string) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/user/validate_email/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token + '' })
        })

        return res;
    }

    static async validateOperatorEmail(token: string) {
        return await fetch(`${process.env.REACT_APP_API_URL}/v1/company/operators/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token + '' })
        })
    }
}

export default ValidateEmailController