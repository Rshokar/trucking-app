import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { TouchableOpacity, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import BigText from '../../components/Texts/BigText'
import SmallText from '../../components/Texts/SmallText'
import { LoginFormResult, RegisterFormResult } from '../../components/Forms/types'
import Form from '../../components/Forms/Form'
import LoginForm from '../../components/Forms/LoginForm'
import RegisterForm from '../../components/Forms/RegisterForm'
import SwipeDownViewAnimation from '../../components/Animated/SwipeDownViewAnimation'
import { AuthController } from '../../controllers/AuthController'
import { User } from '../../models/User'
import { FIREBASE_AUTH } from '../../config/firebaseConfig'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import Cache from '../../utils/Cache'
import { WelcomContainer, TopSection, BottomSection, TopImage } from './styles'


// Custom Components
import { colors } from '../../components/colors'

import { RoofStackParamList } from '../../navigators/RoofStack'
import { StackScreenProps } from '@react-navigation/stack'

import background from '../../assets/welcome.png'
import { CustomerController } from '../../controllers/CustomerController'
import { Customer, CustomerQuery } from '../../models/Customer'
import { CompanyController } from '../../controllers/CompanyController'
import { Operator, OperatorQuery } from '../../models/Operator'
import { OperatorController } from '../../controllers/OperatorController'
import useSnackbar from '../../hooks/useSnackbar'

type Props = StackScreenProps<RoofStackParamList, "Welcome">

const FormView = styled.View`
display: flex; 
flex-directio: column;
justify-content: flex-start; 
padding-horizontal: 5%;
padding-vertical: 10%;
align-items: center; 
width: 100%; 
gap: 20px;
`

const Welcome: FunctionComponent<Props> = ({ navigation }) => {


    const [showLogin, setShowLogin] = useState<boolean>(true)
    const [showAuth, setShowAuth] = useState<boolean>(false)
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();

    const hideAuth = () => setShowAuth(false)

    // We want to check if the current user is logged in
    // If they are logged in then we will redirect to home
    useEffect(() => {
        async function checkTokenValidity() {
            // Get the token from the AuthController
            const token = await AuthController.getJWTToken();

            if (!token) {
                // No token available, perhaps redirect to login
                return;
            }

            // Use Firebase to verify the token
            try {
                const decodedToken = await FIREBASE_AUTH.currentUser?.getIdTokenResult();

                if (!decodedToken) return;
                AuthController.setJWTToken(decodedToken.token);

                // This does not need to happen syncronusly
                await loadCache();

                // If the token is valid, it will decode without throwing an error
                navigation.navigate("Home", { company: await AuthController.getCompany() });
            } catch (error) {
                console.error("Token is not valid or expired:", error);
            }
        }

        checkTokenValidity();
    }, []);

    const loadCache = async () => {
        // First get the customer and operator caches
        const customerCache = Cache.getInstance(Customer);
        const operatorCache = Cache.getInstance(Operator);
        const cC = new CustomerController()
        const oC = new OperatorController();
        const cQ = new CustomerQuery(100);
        const oQ = new OperatorQuery(100);

        const cPromise = cC.getAll(cQ);
        const oPromise = oC.getAll(oQ);

        const [operators, customers] = await Promise.all([oPromise, cPromise]);
        customerCache.setData(customers);
        operatorCache.setData(operators);
    }



    const handleLogin = async (res: LoginFormResult): Promise<any> => {
        let u: User = new User()
        u.email = res.email
        u.password = res.password
        try {
            const res = await signInWithEmailAndPassword(FIREBASE_AUTH, u.email, u.password);
            u.id = res.user.providerId
            await AuthController.setJWTToken(await res.user.getIdToken())
            const cC = new CompanyController();
            const [comp] = await Promise.all([cC.get(), loadCache()]);
            console.log(u);
            AuthController.saveCompany(comp)
            AuthController.saveUser(u)
            showSnackbar({
                message: 'Loged in successfully',
                color: theme.colors.primary
            })
            navigation.navigate("Home", { company: comp })
        } catch (e: any) {
            console.log(e);
            let error: string = "Error logging in. "
            if (e.code === 'auth/user-not-found') {
                error = "User not found"
            } else if (e.code === 'auth/wrong-password') {
                error = 'Incorrect credentials'
            }
            console.log("HELLO WORLD", error)
            showSnackbar({
                message: error,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
        }
    }

    const handleRegister = async (formResult: RegisterFormResult): Promise<any> => {
        let u: User = new User()
        u.password = formResult.password;
        u.email = formResult.email;
        console.log(formResult)
        try {
            const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, u.email, u.password);
            await AuthController.setJWTToken(await res.user.getIdToken())
            const { company } = await AuthController.register(u, formResult.company, res.user.uid)
            showSnackbar({
                message: 'Registered in successfully',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            navigation.navigate("Home", { company })
        } catch (e: any) {
            let error: string = "Error registering."
            if (e.code === 'auth/email-already-in-use')
                error = "Email is already being used"

            showSnackbar({
                message: error,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
        }
    }

    return (
        <>
            <StatusBar style='light' />
            <WelcomContainer>
                <TopSection >
                    <TopImage source={background} />
                </TopSection>
                <BottomSection >
                    <Text variant="headlineLarge" style={{ marginBottom: 10, color: 'white', fontWeight: 'bold' }}>
                        Trucking App
                    </Text>
                    <Text style={{ marginBottom: 25, color: 'white' }}>
                        Drop the books and pick up the future
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Button style={{ backgroundColor: colors.primary, flex: 1 }} onPress={() => {
                            setShowLogin(true);
                            setShowAuth(true);
                        }}>
                            <Text style={{ color: 'white' }}>
                                Login
                            </Text>
                        </Button>
                        <Button style={{ backgroundColor: 'white', flex: 1 }} onPress={() => {
                            setShowLogin(false);
                            setShowAuth(true);
                        }}>
                            <Text style={{ color: theme.colors.primary }}>
                                Register
                            </Text>
                        </Button>
                    </View>
                </BottomSection>
                <SwipeDownViewAnimation show={showAuth} close={hideAuth} VH={.95}>
                    <FormView>
                        <BigText textStyle={{ color: colors.primary }}>{showLogin ? "Welcome Back" : "Create an Account"}</BigText>
                        <Text style={{ color: colors.secondary, textAlign: 'center' }} variant='labelLarge'>
                            {showLogin ? "Welcome to the trucking app, enter you credentials and lets get started" : "Welcome to the trucking app, register and lets get started"}
                        </Text>

                        {
                            showLogin ? <LoginForm onSubmit={handleLogin} /> : <RegisterForm onSubmit={handleRegister} />
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text>
                                    {showLogin ? "Don't have an account?" : "Already have an account?"}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={showLogin ? () => setShowLogin(false) : () => setShowLogin(true)}
                                style={{ justifyContent: 'flex-end', paddingLeft: 5 }}>
                                <Text style={{ color: theme.colors.tertiary }}>
                                    {showLogin ? "Create an account" : "Login"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </FormView>
                </SwipeDownViewAnimation>
            </WelcomContainer>
        </>
    )
}

export default Welcome