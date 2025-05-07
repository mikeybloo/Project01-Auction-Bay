import { makeAutoObservable } from 'mobx'
import type { UserType } from '../Models/auth'
import { userStorage } from '../Util/localStorage'

export interface AuthContextType {
  user?: UserType | null
  login: () => void
  signout: () => void
}

class AuthStore {
  user?: UserType | null = userStorage.getUser() || null

  constructor() {
    makeAutoObservable(this)
  }

  login(user: UserType) {
    userStorage.setUser(user)
    this.user = user
  }

  signout() {
    userStorage.clearUser()
    this.user = undefined
  }
}

const authStore = new AuthStore()
export default authStore
