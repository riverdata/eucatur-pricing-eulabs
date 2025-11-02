import { User } from "@utils/entities";
import api from "@utils/services/api";

type LoginResponseData = {
  token: string
  user: User
}

async function login(payload: any) {
  return (await api.post('/api/login', payload)).data.data as LoginResponseData
}

export const AuthService = {
  login
}