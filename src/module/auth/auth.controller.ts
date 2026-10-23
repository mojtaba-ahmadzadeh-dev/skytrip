import AuthService from './auth.service.js';

class AuthController {
  constructor(private readonly authService: AuthService) {}
}

export default AuthController;
