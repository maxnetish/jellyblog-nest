import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  CredentialsDto,
  FindUserRequest,
  UpdateUserDto,
  UserInfoDto
} from '@jellyblog-nest/auth/model';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@jellyblog-nest/entities';
import { FindConditions, In, Like, Repository } from 'typeorm';
import { BaseEntityId, Page, UserRole } from '@jellyblog-nest/utils/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
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
      secret
    });
    const createdUser = await this.userRepository.save(creatingUser);
    return {
      username: createdUser.username,
      role: createdUser.role,
      uuid: createdUser.uuid
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
          'updatedAt'
        ]
      }
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
      username: found.username
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
      { secret }
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
    const found = await this.userRepository.findOneOrFail(uuid, {
      select: ['uuid', 'username', 'role']
    });
    return {
      username: found.username,
      role: found.role,
      uuid: found.uuid
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const [updatedUser, adminsCount] = await Promise.all([
      this.findById(updateUserDto.uuid),
      this.countOfAdmins()
    ]);

    if (updatedUser.role === UserRole.ADMIN && updateUserDto.role !== UserRole.ADMIN && adminsCount < 2) {
      // check that admin is not last admin
      throw new HttpException('Cannot remove last admin', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userRepository.update(
      updateUserDto.uuid,
      {
        role: updateUserDto.role,
      },
    );

    return !!result;
  }

  async remove(removeRequest: BaseEntityId) {
    const [removedUser, adminsCount] = await Promise.all([
      this.findById(removeRequest.uuid),
      this.countOfAdmins()
    ]);
    if(removedUser.role===UserRole.ADMIN && adminsCount < 2) {
      // we wan't remove last admin
      throw new HttpException('Cannot remove last admin', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userRepository.delete(removeRequest.uuid);
    return !!result;
  }

  async find(findUserRequest: FindUserRequest): Promise<Page<UserInfoDto>> {
    const { page, size, order, role, name } = findUserRequest;
    const where: FindConditions<User> = {};

    if (role && role.length) {
      where.role = In(role);
    }
    if (name) {
      where.username = Like(`%${name}%`);
    }

    const [list, total] = await Promise.all([
      this.userRepository.find({
        select: ['uuid', 'role', 'username'],
        where,
        skip: (page - 1) * size,
        take: size,
        order
      }).then((foundUsers) => {
        return foundUsers.map((user) => {
          return {
            uuid: user.uuid,
            role: user.role,
            username: user.username
          };
        });
      }),
      this.userRepository.count({
        where
      })
    ]);

    return {
      list,
      total,
      page,
      size
    };
  }

  private async countOfAdmins() {
    return this.userRepository.count({
      role: UserRole.ADMIN
    });
  }

  private async seedDefaultAdminIfNoOne() {
    const foundAnyAdminUser = (await this.countOfAdmins()) > 0;
    if (foundAnyAdminUser) {
      console.log('We have admin');
      return true;
    }
    const secret = AuthService.textToHash('jelly', this.hashAlgorythm);
    const creatingUser = this.userRepository.create({
      username: 'admin',
      role: UserRole.ADMIN,
      hashAlgo: 'sha256',
      secret
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
