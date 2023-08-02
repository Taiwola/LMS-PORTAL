import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleService extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env['GOOGLE_CLIENT'],
      clientSecret: process.env['GOOGLE_SECRET'],
      callbackURL: 'http://localhost:3000/auth/google-redirect', // TODO change this to the correct URL once it's
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const token = {
      accessToken,
      refreshToken,
    };
    done(null, profile, token);
  }
}
