const StorageTheme = {
  set: (data: any) => {
    let dataThemes = StorageTheme.get()
    dataThemes.sidebar = data.sidebar ? data.sidebar : dataThemes.sidebar
    localStorage.setItem('@riverdata:theme', JSON.stringify(dataThemes))
  },
  get: () => {
    const data = localStorage.getItem('@riverdata:theme')

    return data ? JSON.parse(data) : {
      sidebar: 'true'
    }
  },
}

export default StorageTheme;