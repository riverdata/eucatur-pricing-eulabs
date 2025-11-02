const StorageUser = {
  set: (data: any) => {
    if (data) localStorage.setItem('@riverdata:user', JSON.stringify(data))
  },
  get: () => {
    const data = localStorage.getItem('@riverdata:user')
    return data ? JSON.parse(data) : null
  },
}

export default StorageUser;