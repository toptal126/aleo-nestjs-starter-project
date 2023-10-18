import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/users/email.service';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, password: string) {
    const user = await this.usersService.createOne(
      email,
      await bcrypt.hash(password, saltOrRounds),
    );

    const payload = { email: user.email, sub: user._id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  public async sendVerificationLink(email: string) {
    const payload = { email };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the Aleo Mine. To confirm the email address, click here: ${url}`;

    // const from = `Excited User <${this.configService.get('EMAIL_USER')}>`;
    return await this.emailService.sendMail({
      from: 'Aleo Mine Team <johanbechic@gmail.com>',
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  async decodeToken(token: string) {
    const { email }: { email: string } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
    });

    const user = await this.usersService.findOne(email);

    user.emailVerified = true;
    await user.save();

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
