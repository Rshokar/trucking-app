// Account.tsx
import React, { FC, useState, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, Snackbar, useTheme } from 'react-native-paper'
import { View } from 'react-native'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Company } from '../../models/Company'
import { User } from '../../models/User'
import { AuthController } from '../../controllers/AuthController'
import UserCompanyForm, { UserCompanyFormResults } from '../../components/Forms/UserCompanyForm';
import UserController from '../../controllers/UserController'

export type Props = StackScreenProps<RoofStackParamList, "Account">

const Account: FC<Props> = (props) => {
    const theme = useTheme();
    const [company, setCompany] = useState<Company>();
    const [user, setUser] = useState<User>();
    const [isEditing, setIsEditing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('success');

    const getCompany = async (): Promise<void> => setCompany(await AuthController.getCompany());
    const getUser = async (): Promise<void> => setUser(await AuthController.getUser());

    useEffect(() => {
        getCompany();
        getUser();
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleSave = async (values: UserCompanyFormResults): Promise<any> => {
        setSnackbarMessage('Updating User!'); // Example Message
        setVisible(true);
        setSnackbarColor('blue')
        try {
            const uC = new UserController()
            const res: UserCompanyFormResults = await uC.updateUserAndCompany(values.email, values.company_name);

            if (company) company.company_name = res.company_name;
            if (user) user.email = res.email;

            setSnackbarMessage('User updated!'); // Example Message
            setVisible(true);
            setSnackbarColor('green')
            setIsEditing(false);
        } catch (err: any) {
            setSnackbarMessage(err.message); // Example Message
            setVisible(true);
            setSnackbarColor('red')
            // TODO: Save updates to backend with values
        }
    }
    return (<>
        <View style={{
            padding: 20,
            gap: 20,
        }}>
            <Text variant='headlineMedium' style={{ textAlign: 'center' }}>Profile</Text>
            {
                company && user &&
                <UserCompanyForm
                    company={company}
                    user={user}
                    isEditing={isEditing}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                />
            }


        </View>
        <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={{ backgroundColor: snackbarColor }}

            action={{
                label: 'Close',
                onPress: () => setVisible(false),
            }}
        >
            {snackbarMessage}
        </Snackbar>
    </>
    );
}

export default Account;
