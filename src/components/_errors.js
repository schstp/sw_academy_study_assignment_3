class LoginError extends Error {
  constructor (message) {
    super()
    this.name = 'LoginError'
    this.message = message
  }
}

class AuthError extends Error {
  constructor (message) {
    super()
    this.name = 'AuthError'
    this.message = message
  }
}

export { LoginError, AuthError }
