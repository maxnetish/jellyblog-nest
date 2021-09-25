import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, CredentialsDto, UserInfoDto } from '@jellyblog-nest/auth/model';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@jellyblog-nest/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
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
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }

  async findByUsername(username: string) {
    const found = await this.userRepository.findOne(
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
    return found;
  }

  async findAndVerify(credentialsDto: CredentialsDto) {
    const found = await this.userRepository.findOne({ username: credentialsDto.username });
    if (!found) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const credentialsPasswordHash = AuthService.textToHash(credentialsDto.password, found.hashAlgo);
    if (credentialsPasswordHash !== found.secret) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return {
      uuid: found.uuid,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      role: found.role,
      username: found.username,
    } as UserInfoDto;
  }

  private static textToHash(inp: string, algo: string): string {
    const hash = crypto.createHash(algo);
    hash.update(inp);
    return hash.digest('hex').toUpperCase();
  };
}
