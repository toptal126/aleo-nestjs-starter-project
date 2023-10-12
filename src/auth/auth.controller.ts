import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
// import { Address } from '@aleohq/sdk';
// import { Signature } from '@aleohq/sdk/dist';

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @Post('verify-signature')
  async verifySignature(
    @Body() verifyDto: { message: string; address: string; signature: string },
  ) {
    const { Address, Signature } = await (eval(
      `import('@aleohq/sdk')`,
    ) as Promise<typeof import('@aleohq/sdk')>);
    const signer = Address.from_string(verifyDto.address);

    return signer.verify(
      new TextEncoder().encode(verifyDto.message),
      Signature.from_string(verifyDto.signature),
    );
  }

  @Get('/')
  TestFunc(@Request() req) {
    return 'asdf';
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
