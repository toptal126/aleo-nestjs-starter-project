import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UsersService } from 'src/users/users.service';
// import { Address } from '@aleohq/sdk';
// import { Signature } from '@aleohq/sdk/dist';

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('verify-signature')
  async verifySignature(
    @Body() verifyDto: { message: string; address: string; signature: string },
    @Request() req,
  ) {
    const { Address, Signature } = await (eval(
      `import('@aleohq/sdk')`,
    ) as Promise<typeof import('@aleohq/sdk')>);
    const signer = Address.from_string(verifyDto.address);

    const verified = signer.verify(
      new TextEncoder().encode(verifyDto.message),
      Signature.from_string(verifyDto.signature),
    );

    if (verified)
      return await this.userService.attachWalletAddress(
        req.user.email,
        verifyDto.address,
      );

    return verified;
  }

  @Get('/')
  TestFunc(@Request() req) {
    return 'asdf';
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('send-verification')
  async sendVerificationCode(@Request() req) {
    const { email }: { email: string } = req.user;
    const user = await this.userService.findOne(email);
    if (user) {
      return await this.authService.sendVerificationLink(user.email, user.code);
    }
    return email;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    return await this.authService.decodeToken(token);
  }

  @HttpCode(HttpStatus.OK)
  @Get('verify-code')
  async verifyCode(@Query('code') code: string, @Request() req) {
    return await this.authService.verifyCode(code, req.user.email);
  }
}
