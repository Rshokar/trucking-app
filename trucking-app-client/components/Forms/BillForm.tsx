import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import { Image, View } from 'react-native'
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import * as Yup from 'yup';
import { ErrorText, FormContainer, InputBox } from './styles';

export type BillFormResult = {
    ticket_number: string;
    file: ImagePicker.ImagePickerAsset; // <-- Include image in type
};

type Props = {
    onSubmit: (values: BillFormResult, id?: string) => Promise<boolean>;
    defaultValues?: any;
};

const BillFormSchema = Yup.object().shape({
    ticket_number: Yup.string()
        .required('Required')
        .min(2, "Too short")
        .max(200, "Too long"),
});

const BillForm: FC<Props> = ({ onSubmit, defaultValues }) => {
    const theme = useTheme();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();  // <-- State to hold the picked image
    const [imageError, setImageError] = useState<string>();


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }

    return (
        <Formik
            initialValues={(defaultValues ?? {}) as BillFormResult}
            validationSchema={BillFormSchema}
            onSubmit={async (values, { setSubmitting }) => {
                if (!image && !defaultValues) {
                    setImageError("Image is required");
                    return;
                } else if (defaultValues) {
                    await onSubmit(values);
                } else if (image) {
                    values.file = image; // <-- Assign image to the values before submission
                    await onSubmit(values);
                }
                setSubmitting(false);

            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => {
                return (
                    <FormContainer>
                        <InputBox>
                            <TextInput
                                label="Ticket Number"
                                onChangeText={handleChange('ticket_number')}
                                onBlur={handleBlur('ticket_number')}
                                value={values.ticket_number}
                                error={!!errors.ticket_number}
                            />
                            {errors.ticket_number && <ErrorText>{errors.ticket_number}</ErrorText>}
                        </InputBox>
                        {(!defaultValues && image) && <Image source={{ uri: image.uri }} style={{ width: '100%', height: 300 }} />}
                        {
                            !defaultValues &&
                            <InputBox>
                                <Button
                                    style={{ backgroundColor: theme.colors.tertiary }}
                                    onPress={pickImage}
                                >
                                    <Text style={{ color: 'white' }}>
                                        Pick Image
                                    </Text>
                                </Button>
                                {imageError && <ErrorText>{imageError}</ErrorText>}
                            </InputBox>
                        }
                        <Button
                            onPress={(e) => handleSubmit()}
                            disabled={isSubmitting}
                            style={{
                                backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary,
                                width: '100%',
                            }}

                        >
                            <Text style={{ color: 'white' }}>
                                {isSubmitting ? "Loading..." : "Submit"}

                            </Text>
                        </Button>
                    </FormContainer>
                )
            }}
        </Formik>
    )
}

export default BillForm;
