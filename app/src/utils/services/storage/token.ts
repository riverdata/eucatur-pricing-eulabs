const StorageToken = {
  set: (data: string) => {
    if (data) localStorage.setItem('@riverdata:token', data)
  },
  get: () => {
    return localStorage.getItem('@riverdata:token')
  },
}

export default StorageToken;