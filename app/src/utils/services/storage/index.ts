import StorageTheme from "./theme"
import StorageToken from "./token"
import StorageUser from "./user"

export const Storage = {
  User: StorageUser,
  Token: StorageToken,
  Theme: StorageTheme,
  clear: () => {
    localStorage.clear()
  }
}

export const StorageService = Storage