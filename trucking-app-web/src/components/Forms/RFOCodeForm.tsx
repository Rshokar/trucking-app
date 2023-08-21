import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Typography
} from '@mui/material';

type Props = {
    onSubmit: (code: string) => Promise<void>;
}

const RFOCodeForm = (props: Props) => {
    const { onSubmit } = props;

    const formik = useFormik({
        initialValues: {
            code: ''
        },
        validationSchema: Yup.object({
            code: Yup.string()
                .required('Code is required')
                .length(6, 'Code should be 6 digits')
        }),
        onSubmit: async (values) => {
            await onSubmit(values.code);
        }
    });

    useEffect(() => {
        if (formik.values.code.length === 6) {
            formik.handleSubmit();
        }
    }, [formik.values.code, formik.handleSubmit]);

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="code"
                    name="code"
                    label="Verification Code"
                    variant="outlined"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    error={formik.touched.code && Boolean(formik.errors.code)}
                    helperText={formik.touched.code && formik.errors.code}
                    inputProps={{ maxLength: 6 }}
                />
            </form>
        </>
    );
};

export default RFOCodeForm;
