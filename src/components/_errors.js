class AuthError extends Error {
  constructor (message) {
    super()
    this.name = 'AuthError'
    this.message = message
  }
}

export { AuthError }
