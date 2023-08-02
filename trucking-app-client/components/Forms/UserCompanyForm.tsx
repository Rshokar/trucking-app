// UserCompanyForm.tsx
import React, { FC, } from 'react';
import { TextInput, Button, Switch, Text } from 'react-native-paper';
import { View } from 'react-native';
import { InputBox } from '../../components/Forms/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Company } from '../../models/Company';
import { User } from '../../models/User';

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
    company_name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

export interface UserCompanyFormResults {
    email: string,
    company_name: string,
}

interface UserCompanyFormProps {
    company: Company,
    user: User,
    isEditing: boolean,
    handleEdit: () => any,
    handleSave: (data: UserCompanyFormResults) => Promise<any>,
}

const UserCompanyForm: FC<UserCompanyFormProps> = ({ company, user, isEditing, handleEdit, handleSave }) => {

    return (
        <Formik
            initialValues={{
                company_name: company?.company_name || '',
                email: user?.email || '',
            }}
            onSubmit={handleSave}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                return (
                    <View>
                        <InputBox>
                            <TextInput
                                label="Company Name"
                                onChangeText={handleChange('company_name')}
                                onBlur={handleBlur('company_name')}
                                value={values.company_name}
                                editable={isEditing}
                            />
                            {touched.company_name && errors.company_name && <Text>{errors.company_name}</Text>}
                        </InputBox>
                        <InputBox>
                            <TextInput
                                label="User Email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                editable={isEditing}
                            />
                            {touched.email && errors.email && <Text>{errors.email}</Text>}
                        </InputBox>
                        <Button mode="contained" onPress={handleEdit} style={{ marginBottom: 10 }}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                        {isEditing &&
                            <Button mode="contained" onPress={() => handleSubmit()}>
                                Save
                            </Button>
                        }
                    </View>
                )
            }}
        </Formik>
    );
};

export default UserCompanyForm;
