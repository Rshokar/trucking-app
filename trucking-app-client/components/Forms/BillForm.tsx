import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import { Image, View } from 'react-native'
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import * as Yup from 'yup';
import { InputBox } from './styles';

export type BillFormResult = {
    ticket_number: string;
    file: ImagePicker.ImagePickerAsset; // <-- Include image in type
};

type Props = {
    onSubmit: (values: BillFormResult, id?: string) => Promise<boolean>;
    defaultValues?: any;
};

const BillFormSchema = Yup.object().shape({
    ticket_number: Yup.string().required('Required'),
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



        console.log(result);

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
                    console.log("HELLO")
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
                    <>
                        <InputBox>
                            <TextInput
                                label="Ticket Number"
                                onChangeText={handleChange('ticket_number')}
                                onBlur={handleBlur('ticket_number')}
                                value={values.ticket_number}
                                error={errors.ticket_number ? true : false}
                            />
                        </InputBox>
                        {!defaultValues && image && <Image source={{ uri: image.uri }} style={{ width: '100%', height: 300 }} />}
                        {
                            !defaultValues &&
                            <>
                                <Button onPress={pickImage}>Pick Image</Button>
                                <View>
                                    <Text>{imageError}</Text>
                                </View>
                            </>
                        }
                        <Button mode="contained" onPress={() => handleSubmit()} disabled={isSubmitting} style={{ marginTop: 10, backgroundColor: theme.colors.primary }}>
                            {isSubmitting ? "Submitting...." : "Submit"}
                        </Button>
                    </>
                )
            }}
        </Formik>
    )
}

export default BillForm;
