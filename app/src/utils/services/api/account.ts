import api from "@utils/services/api"

type ForgotPasswordInput = {
  email: string
}

type UpdatePasswordInput = {
  token: string
  password: string
}

type ActiveAccountInput = UpdatePasswordInput

async function forgotPassword(payload: ForgotPasswordInput) {
  return (await api.post('/api/account/forgot-password', payload)).data
}

async function updatePassword(payload: UpdatePasswordInput) {
  return (await api.post('/api/account/update-password', payload)).data
}

async function activeAccount(payload: ActiveAccountInput) {
  return (await api.post('/api/account/active', payload)).data
}

export const AccountService = {
  forgotPassword,
  updatePassword,
  active: activeAccount
}