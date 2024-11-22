import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  SignUp(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('sign-in')
  SignIn(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
}
