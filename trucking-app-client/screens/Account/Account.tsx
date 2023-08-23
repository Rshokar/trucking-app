// Account.tsx
import React, { FC, useState, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, Snackbar, useTheme, Button } from 'react-native-paper'
import { View } from 'react-native'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Company } from '../../models/Company'
import { User } from '../../models/User'
import { AuthController } from '../../controllers/AuthController'
import UserCompanyForm, { UserCompanyFormResults } from '../../components/Forms/UserCompanyForm';
import UserController from '../../controllers/UserController'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../config/firebaseConfig'
import useSnackbar from '../../hooks/useSnackbar'

export type Props = StackScreenProps<RoofStackParamList, "Account">

const Account: FC<Props> = (props) => {
    const theme = useTheme();
    const [company, setCompany] = useState<Company>();
    const [user, setUser] = useState<User>();
    const [isEditing, setIsEditing] = useState(false);
    const { showSnackbar } = useSnackbar();

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
        try {
            const uC = new UserController()
            const res: UserCompanyFormResults = await uC.updateUserAndCompany(values.email, values.company_name);

            if (company) company.company_name = res.company_name;
            if (user) user.email = res.email;

            showSnackbar({
                color: theme.colors.primary,
                message: "Updated User!",
                onClickText: 'Ok'
            })
            setIsEditing(false);
        } catch (err: any) {
            showSnackbar({
                color: theme.colors.error,
                onClickText: 'Ok',
                message: err.message
            })
        }
    }

    const handleLogout = async () => {
        try {
            await AuthController.logout()
            await signOut(FIREBASE_AUTH);
            showSnackbar({
                color: theme.colors.primary,
                message: "User logged out!",
                onClickText: 'Ok'
            })
            props.navigation.navigate('Welcome')
        } catch (err: any) {
            showSnackbar({
                color: theme.colors.error,
                onClickText: 'Ok',
                message: err.message
            })
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
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
            <Button
                style={{ backgroundColor: theme.colors.error }}
                onPress={handleLogout}>
                <Text style={{ color: 'white' }}>
                    Logout
                </Text>
            </Button>
        </View>
    </>
    );
}

export default Account;
