import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  googleLogin(req: Request) {
    if (!req.user) {
      return 'No user from google';
    }

    const user = req.user;
    const createUser = {
      email: user._json.email || '', // Google doesn't provide the email in _json
      firstname: user.name.familyName,
      lastname: user.name.givenName,
      image: user._json.picture,
    };

    console.log(createUser);

    return {
      message: 'User information from google',
      user: req.user,
      createUser,
    };
  }
}
