import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getJwtSecret(): string {
    const JWT_SECRET = this.configService.get<string>('JWT_SECRET');
    return `${JWT_SECRET}`;
  }

  getRefreshSecret(): string {
    const REFRESH_SECRET = this.configService.get<string>('REFRESH_SECRET');
    return `${REFRESH_SECRET}`;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(`Email already in use or account is locked`);
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    const newUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });
    const savedUser = await this.userRepository.save(newUser);
    const { password, ...result } = savedUser;
    return {
      user: result,
      message: `Registration successful. Please login to continue`,
    };
  }

  async createAdmin(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(`Email already in use`);
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    const newUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    const savedUser = await this.userRepository.save(newUser);
    const { password, ...result } = savedUser;
    return {
      user: result,
      message: `Admin User created successfuly.`,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials or account does not exist',
      );
    }

    //generate the tokens
    const tokens = this.generateTokens(user);
    const { password, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.getRefreshSecret(),
      });

      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const accessToken = this.generateAccessToken(user);

      return accessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  //find the current user by id
  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User): string {
    //email, id, role, vvv1 implementing role based access controll
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.getJwtSecret(),
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: '30d',
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    incomingPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(incomingPassword, hashedPassword);
  }
}
