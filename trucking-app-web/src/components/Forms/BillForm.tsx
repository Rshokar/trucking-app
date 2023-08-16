import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextField,
    InputLabel,
    Typography,
    useTheme
} from '@mui/material';


export interface BillFormResult {
    ticket_number: string;
    file: File; // <-- Use File type for web
}

interface Props {
    onSubmit: (values: BillFormResult, id?: string) => Promise<boolean>;
    defaultValues?: any;
}


const BillFormSchema = Yup.object().shape({
    ticket_number: Yup.string()
        .required('Required')
        .min(2, 'Too short')
        .max(200, 'Too long'),
});

const BillForm: React.FC<Props> = ({ onSubmit, defaultValues }) => {
    const theme = useTheme();
    const [file, setFile] = useState<File>();
    const [fileError, setFileError] = useState<string>();

    const formik = useFormik({
        initialValues: {
            ticket_number: '',
        } as BillFormResult,
        validationSchema: BillFormSchema,
        onSubmit: async (values: BillFormResult, { setSubmitting }: any) => {
            if (!file && !defaultValues) {
                setFileError('File is required');
                return;
            } else if (defaultValues) {
                await onSubmit(values);
            } else if (file) {
                values.file = file; // <-- Assign file to the values before submission
                await onSubmit(values);
            }
            setSubmitting(false);
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    return (
        <>
            <TextField
                label="Ticket Number"
                name="ticket_number"
                variant="outlined"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ticket_number}
                error={formik.touched.ticket_number && Boolean(formik.errors.ticket_number)}
                helperText={formik.touched.ticket_number && formik.errors.ticket_number}
            />
            {!defaultValues && (
                <div>
                    <InputLabel htmlFor="file">Upload File</InputLabel>
                    <input
                        id="file"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    {fileError && <Typography variant="body2" style={{ color: theme.palette.error.main }}>{fileError}</Typography>}
                </div>
            )}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    formik.handleSubmit();
                }}
            >
                {formik.isSubmitting ? 'Loading...' : 'Submit'}
            </Button>
        </>
    );
};

export default BillForm;
