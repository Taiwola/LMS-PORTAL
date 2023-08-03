import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import {
  signInUser,
  Payload,
  forgotPasswordInterface,
  JwtPayload,
} from './interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { MailService } from '../service/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // utility methods
  async hashpwd(password: string) {
    const salt = 10;
    const hashpassword = await bcrypt.hash(password, salt);
    return hashpassword;
  }

  async generateToken(payload: Payload) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async generateResetToken(payload: Payload) {
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RESET,
      expiresIn: '1h',
    });
    return token;
  }

  // CRUD methods
  async createUser(createAuthDto: CreateAuthDto) {
    const { password } = createAuthDto;
    const hashpwd = await this.hashpwd(password);
    createAuthDto.password = hashpwd;
    const user = await this.userService.create(createAuthDto);
    const sendMail = await this.mailService.sendWelcomeMail(
      createAuthDto.email,
    );
    return {
      message: 'user created',
      data: user,
      mail: 'successful',
      sendMail,
    };
  }

  async createAdmin(createAuthDto: CreateAuthDto) {
    const { password } = createAuthDto;
    const hashpwd = await this.hashpwd(password);
    createAuthDto.password = hashpwd;
    const user = await this.userService.createAdmin(createAuthDto);
    return {
      message: 'admin created',
      user,
    };
  }

  async forgotPassword(forgotPwd: forgotPasswordInterface) {
    const { email } = forgotPwd;
    const user = await this.userService.checkUserExist(email);
    console.log(email);
    console.log(user);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.generateResetToken(payload);

    const resetLink = `localhost:3000/auth/reset/${token}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendMail = this.mailService.sendResetPassword(user.email, resetLink);

    return {
      message: 'successful',
    };
  }

  async resetPassword(token: string, reset: forgotPasswordInterface) {
    const verifyToken = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_RESET,
    });

    console.log(verifyToken);

    if (!verifyToken) {
      throw new HttpException(
        'verification failed',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const decode = this.jwtService.decode(token) as JwtPayload;

    console.log(decode);

    if (!decode) {
      throw new HttpException(
        'unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const user = await this.userService.checkUserById(decode.id);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const hashPwd = await this.hashpwd(reset.password);

    const resetPassword = await this.userService.updatePassword(
      hashPwd,
      user.id,
    );

    if (!resetPassword) {
      throw new HttpException(
        `unable to update password`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { data: resetPassword, message: 'password successfully reset' };
  }

  async signinUser(signIn: signInUser, res: Response) {
    const { email } = signIn;
    const checkUserExist = await this.userService.checkUserExist(email);
    if (!checkUserExist) {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(
      signIn.password,
      checkUserExist.password,
    );
    if (!isMatch) {
      throw new HttpException('invalid credential', HttpStatus.UNAUTHORIZED);
    }
    const payload = {
      id: checkUserExist.id,
      email: checkUserExist.email,
    };
    const access_token = await this.generateToken(payload);
    const refresh_token = await this.generateToken(payload);

    res.cookie('jwt', refresh_token, {
      httpOnly: true,
      secure: false, // set to true in production for https connection only!
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = checkUserExist;
    res.status(200).json({
      message: 'user logged in successfully',
      access_token,
      data: result,
    });
  }

  async logoutUser(req: Request, res: Response) {
    const token = req.cookies.jwt;

    if (!token) {
      return { message: 'user logged out' };
    }

    res.clearCookie('jwt', { httpOnly: true });
    res.status(200).json({ message: 'user logged out' });
  }

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
