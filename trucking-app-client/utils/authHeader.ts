import { AuthController } from "../controllers/AuthController"

export const getAuthHeader = async () => {
    return { "Authorization-Fake-X": `Bearer ${await AuthController.getJWTToken()}` }
}