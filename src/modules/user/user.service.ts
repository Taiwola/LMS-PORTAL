import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRoles } from './entities/user.entity';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // methods or utility methods
  async checkUserExist(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  async checkUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  async updatePassword(password: string, id: string) {
    try {
      const updatePassword = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: password })
        .where('id = :id', { id: id })
        .execute();
      return updatePassword;
    } catch (error) {
      console.log('Error updating Password:', error);
      throw new InternalServerErrorException();
    }
  }

  // CRUD METHODS
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existEmail = await this.checkUserExist(email);
    if (existEmail) {
      throw new HttpException(
        'can not use this email, already in use',
        HttpStatus.AMBIGUOUS,
      );
    }
    const user = this.userRepository.create({
      ...createUserDto,
    });
    return await this.userRepository.save(user);
  }

  async createAdmin(createAdminDto: CreateUserDto) {
    const { email } = createAdminDto;
    const userExist = await this.checkUserExist(email);
    if (userExist) {
      throw new HttpException(
        'can not use this email, already in use',
        HttpStatus.AMBIGUOUS,
      );
    }
    const user = this.userRepository.create({
      ...createAdminDto,
      roles: UserRoles.ADMIN,
    });

    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return result;
  }

  async findAll() {
    const user = await this.userRepository.find();
    const filterPassword = user.filter((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
    return filterPassword;
  }

  async findOne(id: string) {
    const user = await this.checkUserById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto, req: Request) {
    const user = await this.checkUserById(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    const userReq = req.userID;
    const userId = userReq.id;

    if (userId !== user.id) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }

    const updateUser = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...updateUserDto })
      .where('id = :id', { id: id })
      .execute();

    if (updateUser.affected >= 1) {
      const updatedUser = await this.checkUserById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return {
        message: 'user update',
        data: result,
      };
    }
  }

  async addAdmin(id: string) {
    const user = await this.checkUserById(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    const updateUser = await this.userRepository.update(
      { id: id },
      { roles: UserRoles.ADMIN },
    );
    if (updateUser.affected >= 1) {
      const updatedUser = await this.checkUserById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return result;
    }
  }

  async remove(id: string, req: Request) {
    const user = await this.checkUserById(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    const userId = req.userID.id;
    const userRole = await this.checkUserById(userId);

    if (userId !== user.id && userRole.roles !== UserRoles.ADMIN) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const removeUser = await this.userRepository.delete(id);
      return { message: 'user deleted successfully' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async blockUser(id: string) {
    const user = await this.checkUserById(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    if (user.isBlocked === true) {
      throw new HttpException('user is already blocked', HttpStatus.CONFLICT);
    }

    const updateUser = await this.userRepository.update(
      { id: id },
      { isBlocked: true },
    );

    console.log(updateUser);

    if (updateUser.affected >= 1) {
      const updatedUser = await this.checkUserById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return {
        message: 'user blocked',
        data: result,
      };
    }
  }

  async unBlockUser(id: string) {
    const user = await this.checkUserById(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    if (user.isBlocked === false) {
      throw new HttpException('user is already unblocked', HttpStatus.CONFLICT);
    }

    const updateUser = await this.userRepository.update(
      { id: id },
      { isBlocked: false },
    );

    if (updateUser.affected >= 1) {
      const updatedUser = await this.checkUserById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return {
        message: 'user unblocked',
        data: result,
      };
    }
  }
}
