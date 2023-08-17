import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextField,
    useTheme
} from '@mui/material';
import { MuiFileInput } from 'mui-file-input'
import { ErrorText } from './styles';


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
        initialValues: defaultValues || {
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

    const handleFileChange = (file: File) => {
        if (file) {
            const validTypes = ['image/png', 'image/jpeg'];
            if (validTypes.includes(file.type)) {
                setFile(file);
                setFileError(''); // Clear any previous error message
            } else {
                setFileError('Invalid file type. Please upload a PNG or JPEG image.');
            }
        }
    }

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
            {!defaultValues && <div>
                <MuiFileInput
                    style={{
                        border: `.5px solid ${fileError ? '#C73E1D' : 'transparent'}`,
                        borderRadius: '5px',
                        color: fileError ? '#C73E1D' : 'transparent',
                    }}
                    value={file}
                    onChange={(value) => value ? handleFileChange(value) : null}
                    inputProps={{ accept: '.png, .jpeg' }}
                />
                {fileError && <ErrorText variant='caption' style={{

                }}>{fileError}</ErrorText>}
            </div>
            }

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
