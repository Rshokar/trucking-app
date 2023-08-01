import React, { FC, useState, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { TextInput, Button } from 'react-native-paper';
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Company } from '../../models/Company'
import { User } from '../../models/User'
import { AuthController } from '../../controllers/AuthController'
import { View } from 'react-native';

export type Props = StackScreenProps<RoofStackParamList, "Account">

const Account: FC<Props> = (props) => {
    const [company, setCompany] = useState<Company>();
    const [user, setUser] = useState<User>();
    const [isEditing, setIsEditing] = useState(false);

    const getCompany = async (): Promise<void> => setCompany(await AuthController.getCompany());
    const getUser = async (): Promise<void> => setUser(await AuthController.getUser());

    useEffect(() => {
        getCompany();
        getUser();
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleSave = () => {
        // TODO: Save updates to backend
        setIsEditing(false);
    }

    return (
        <View>
            <TextInput
                label="Company Name"
                value={company?.company_name}
                editable={isEditing}
            />
            <TextInput
                label="User Email"
                value={user?.email}
                editable={isEditing}
            />
            <Button mode="contained" onPress={handleEdit}>
                {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            {isEditing &&
                <Button mode="contained" onPress={handleSave}>
                    Save
                </Button>
            }
        </View>
    )
}

export default Account;
