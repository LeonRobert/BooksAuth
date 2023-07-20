// Mock-up AUTH service
const AuthService = {
  login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'user1' && password === 'pass1') {
          resolve({ username: 'user1' })
        } else if (username === 'user2' && password === 'pass2') {
          resolve({ username: 'user2' })
        } else {
          reject(new Error('Invalid username or password'))
        }
      }, 1000)
    })
  },
  setLoggedInUser(user, sessionTimeout) {
    const now = new Date()
    const expirationTime = new Date(now.getTime() + sessionTimeout * 1000)
    const userData = { user, expirationTime: expirationTime.toISOString() }
    localStorage.setItem('loggedInUser', JSON.stringify(userData))
  },

  getLoggedInUser() {
    const userData = localStorage.getItem('loggedInUser')
    if (!userData) return null

    const { user, expirationTime } = JSON.parse(userData)
    const now = new Date()
    if (new Date(expirationTime) > now) {
      return user
    } else {
      AuthService.clearLoggedInUser()
      return null
    }
  },

  clearLoggedInUser() {
    localStorage.removeItem('loggedInUser')
  },
}

export default AuthService
