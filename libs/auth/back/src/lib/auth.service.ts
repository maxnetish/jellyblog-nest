import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangePasswordDto, CreateUserDto, CredentialsDto, UserInfoDto } from '@jellyblog-nest/auth/model';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@jellyblog-nest/entities';
import { FindConditions, In, Like, Repository } from 'typeorm';
import { UserRole } from '@jellyblog-nest/utils/common';
import { FindUserRequest } from '../../../model/src/lib/find-user-request';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.seedDefaultAdminIfNoOne().then(null, () => {
      throw new Error('Cannot seed default admin user.');
    });
  }

  private hashAlgorythm = 'sha256';

  async createUser(createUserDto: CreateUserDto): Promise<UserInfoDto> {
    const secret = AuthService.textToHash(createUserDto.password, this.hashAlgorythm);
    const creatingUser = this.userRepository.create({
      username: createUserDto.username,
      role: createUserDto.role,
      hashAlgo: this.hashAlgorythm,
      secret,
    });
    const createdUser = await this.userRepository.save(creatingUser);
    return {
      username: createdUser.username,
      role: createdUser.role,
      uuid: createdUser.uuid,
    };
  }

  async findByUsername(username: string): Promise<UserInfoDto> {
    if (!username) {
      throw new HttpException('username cannot be empty', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.findOne(
      { username },
      {
        select: [
          'username',
          'role',
          'uuid',
          'createdAt',
          'updatedAt',
        ],
      },
    );
  }

  async findAndVerify(credentialsDto: CredentialsDto): Promise<UserInfoDto | null> {
    const { username, password } = credentialsDto;
    if (!username) {
      throw new HttpException('username cannot be empty', HttpStatus.BAD_REQUEST);
    }
    if (!password) {
      throw new HttpException('password cannot be empty', HttpStatus.BAD_REQUEST);
    }
    const found = await this.userRepository.findOne({ username });
    if (!found) {
      return null;
    }
    const credentialsPasswordHash = AuthService.textToHash(password, found.hashAlgo);
    if (credentialsPasswordHash !== found.secret) {
      return null;
    }
    return {
      uuid: found.uuid,
      role: found.role,
      username: found.username,
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { newPassword, ...creds } = changePasswordDto;
    if (!newPassword) {
      throw new HttpException('new passowrd cannot be empty', HttpStatus.BAD_REQUEST);
    }
    const existingUser = await this.findAndVerify(creds);
    const secret = AuthService.textToHash(newPassword, this.hashAlgorythm);
    const result = await this.userRepository.update(
      existingUser.uuid,
      { secret },
    );
    if (!result.affected) {
      throw new HttpException('Update password fails.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
  }

  async findById(uuid: string): Promise<UserInfoDto> {
    if (!uuid) {
      throw new Error('uuid cannot be empty');
    }
    const found = await this.userRepository.findOne(uuid, {
      select: ['uuid', 'username', 'role'],
    });
    return {
      username: found.username,
      role: found.role,
      uuid: found.uuid,
    };
  }

  async find(findUserRequest: FindUserRequest): Promise<UserInfoDto[]> {
    const where: FindConditions<User> = {};

    if(findUserRequest.role && findUserRequest.role.length) {
      where.role = In(findUserRequest.role);
    }
    if(findUserRequest.name) {
      where.username = Like(`%${findUserRequest.name}%`);
    }

    return this.userRepository.find({
      select: ['uuid', 'role', 'username'],
      where,
      skip: (findUserRequest.page - 1) * findUserRequest.size,
      take: findUserRequest.size,
      order: findUserRequest.order,
    }).then((foundUsers) => {
      return foundUsers.map((user) => {
        return {
          uuid: user.uuid,
          role: user.role,
          username: user.username,
        };
      });
    });
  }

  private async seedDefaultAdminIfNoOne() {
    const foundAnyAdminUser = await this.userRepository.findOne({
      role: UserRole.ADMIN,
    });
    if (foundAnyAdminUser) {
      console.log('We have admin');
      return true;
    }
    const secret = AuthService.textToHash('jelly', this.hashAlgorythm);
    const creatingUser = this.userRepository.create({
      username: 'admin',
      role: UserRole.ADMIN,
      hashAlgo: 'sha256',
      secret,
    });
    await this.userRepository.save(creatingUser);
    console.log(`There are no admin yet, so create new one: "${creatingUser.username}"`);
    return true;
  }

  private static textToHash(inp: string, algo: string): string {
    const hash = crypto.createHash(algo);
    hash.update(inp);
    return hash.digest('hex').toUpperCase();
  };

}
