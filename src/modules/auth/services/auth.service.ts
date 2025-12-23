import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/modules/users/domain/entities/user.entity';
import { VerificationToken } from 'src/modules/verification/domain/entities/verification-token.entity';
import { RefreshToken } from '../domain/entities/refresh-token.entity';
import { LoginResponse } from '../types/auth-response.type';
import { JwtAccessPayload, JwtRefreshPayload } from '../types/jwt-payload.type';
import { Role } from 'src/modules/role/domain/entities/role.entity';
import { UserRole } from 'src/modules/users/domain/entities/user-role';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import {
  OrganizationRequestDto,
  OrganizationResponseDto,
} from '../application/dto/organization.dto';
import { SlugService } from 'src/common/helpers/slug';
import { getErrorMessage } from 'src/common/utils/error.util';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(VerificationToken)
    private readonly vtRepo: Repository<VerificationToken>,
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,

    private dataSource: DataSource,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly slugSvc: SlugService,
  ) {
    this.saltRounds = Number(
      this.config.get<number>('BCRYPT_SALT_ROUNDS') ?? 12,
    );
  }
  async createOrganisation(
    email: string,
    request: OrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    let response: OrganizationResponseDto | null = null;
    // 1. make sure reuqest body information is not empty
    if (!request || !email || !request.companyName)
      throw new BadRequestException(
        'Request body and parameter cannot be empty',
      );

    // 2. Create a query runner instance
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // 3. Start DB transaction
    await queryRunner.startTransaction();

    try {
      // 4. Get the user inside transaction
      const user_profile = await queryRunner.manager.findOne(User, {
        where: { email },
        relations: ['organization'],
      });
      if (!user_profile) {
        throw new NotFoundException(
          'Email address for this user does not exist',
        );
      }

      if (user_profile.organization) {
        throw new BadRequestException(
          'User already belongs to an organization',
        );
      }

      // 5. Auto-generate a unique slug
      const slug_name = await this.slugSvc.generateUnique(
        request.companyName,
        async (slug) =>
          await queryRunner.manager.exists(Organization, {
            where: { slug },
          }),
      );

      // 6. Create organization entity
      const org_profile = queryRunner.manager.create(Organization, {
        name: request.companyName,
        email: request.companyEmail,
        phoneNumber: request.companyPhoneNumber,
        website: request.companyWebsite,
        slug: slug_name,
        owner: user_profile,
      });

      // 7. Save organization
      const savedOrganization = await queryRunner.manager.save(
        Organization,
        org_profile,
      );

      // 9. Assign organization to user and save
      user_profile.organization = savedOrganization;
      await queryRunner.manager.save(User, user_profile);

      // 10. Commit transaction
      await queryRunner.commitTransaction();

      //11. return response
      response = {
        id: savedOrganization.id,
        companyName: savedOrganization.name,
        UserEmail: email,
        createdAt: savedOrganization.createdAt,
      };
      return response;
    } catch (err) {
      const message = getErrorMessage(err);
      console.log('Organization Service: ', message);
      throw new InternalServerErrorException(message);
    }
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    roleId: string,
  ): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const role = await this.roleRepo.findOne({
      where: { id: roleId },
    });
    if (!role)
      throw new BadRequestException('Invalid Role in the request body');

    const hashed = await bcrypt.hash(password, this.saltRounds);

    return await this.dataSource.transaction(async (manager) => {
      // 1️⃣ Create User
      const user = manager.create(User, {
        email,
        passwordHashed: hashed,
        firstName,
        lastName,
        isVerified: false,
      });

      const savedUser = await manager.save(user);

      // 2️⃣ Create UserRole (junction table)
      const userRole = manager.create(UserRole, {
        user: savedUser,
        role: role,
      });
      await manager.save(userRole);

      // 3️⃣ Create VerificationToken
      const token =
        Math.random().toString(36).slice(2) + Date.now().toString(36);

      const vt = manager.create(VerificationToken, {
        user: savedUser,
        token,
        type: 'email_verification',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h expiration
      });

      await manager.save(vt);

      return savedUser;
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['organization', 'userRoles', 'userRoles.role'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHashed);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password)
      throw new BadRequestException('Request body cannot be empty');

    const user_profile = await this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        passwordHashed: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
      },
      relations: ['userRoles', 'userRoles.role', 'organization'],
    });
    if (!user_profile) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // console.log('Authentication Service - User profile', user_profile);

    const validPassword = await bcrypt.compare(
      password,
      user_profile.passwordHashed,
    );
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles: string[] =
      user_profile.userRoles
        ?.map((r) => r.role.name)
        .filter((f): f is string => typeof f === 'string') ?? [];

    // ----------------------------
    // Generate Access Token
    // ----------------------------
    const accessPaylod: JwtAccessPayload = {
      sub: user_profile.id,
      email: user_profile.email,
      roles,
      organizationId: user_profile.organization
        ? user_profile.organization.id
        : undefined,
    };
    const accessOptions: JwtSignOptions = {
      secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn:
        this.config.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN') ?? '15m',
    };
    const accessToken = this.jwt.sign(accessPaylod, accessOptions);

    // ----------------------------
    // Generate Refresh Token
    // ----------------------------
    const refreshPayload: JwtRefreshPayload = {
      sub: user_profile.id,
    };
    const refreshOptions: JwtSignOptions = {
      secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET')!,
      expiresIn:
        this.config.get<number>('JWT_REFRESH_TOKEN_EXPIRES_IN') ?? '7d',
    };
    const refreshToken = this.jwt.sign(refreshPayload, refreshOptions);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user_profile.id,
        email: user_profile.email,
        firstName: user_profile.firstName,
        lastName: user_profile.lastName,
        avatarUrl: user_profile.avatarUrl,
        phone: user_profile.phone,
        isVerified: user_profile.isVerified,
        roles,
        organizationId: user_profile.organization?.id ?? undefined,
      },
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const verifyOptions: JwtVerifyOptions = {
      secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET')!,
    };

    const payload = this.jwt.verify<JwtRefreshPayload>(
      refreshToken,
      verifyOptions,
    );

    const userId = payload.sub;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['organization', 'userRoles', 'userRoles.role'],
    });
    if (!user) throw new UnauthorizedException('Invalid token user');

    const roles: string[] =
      user.userRoles
        ?.map((ur) => ur.role?.name)
        .filter((r): r is string => typeof r === 'string') ?? [];

    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      roles,
      organizationId: user.organization?.id ?? undefined,
    };

    const accessOptions: JwtSignOptions = {
      secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET')!,
      expiresIn:
        this.config.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN') ?? '15m',
    };

    const accessToken = this.jwt.sign(accessPayload, accessOptions);

    return { accessToken };
  }

  async revokeRefreshToken(refreshTokenPlain: string): Promise<boolean> {
    const tokens = await this.rtRepo.find();
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshTokenPlain, t.tokenHash);
      if (match) {
        await this.rtRepo.remove(t);
        return true;
      }
    }
    return false;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const vt = await this.vtRepo.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!vt) throw new BadRequestException('Invalid token');
    if (vt.expiresAt.getTime() < Date.now()) {
      await this.vtRepo.remove(vt);
      throw new BadRequestException('Token expired');
    }

    vt.user.isVerified = true;
    await this.userRepo.save(vt.user);
    await this.vtRepo.remove(vt);
    return true;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return; // don't leak user existence

    const token = this.generateTokenString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const vt = this.vtRepo.create({
      user,
      token,
      type: 'password_reset',
      expiresAt,
    });
    await this.vtRepo.save(vt);

    // TODO: enqueue/send password reset email
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const vt = await this.vtRepo.findOne({
      where: { token, type: 'password_reset' },
      relations: ['user'],
    });
    if (!vt) throw new BadRequestException('Invalid token');
    if (vt.expiresAt.getTime() < Date.now()) {
      await this.vtRepo.remove(vt);
      throw new BadRequestException('Expired token');
    }

    vt.user.passwordHashed = await bcrypt.hash(newPassword, this.saltRounds);
    await this.userRepo.save(vt.user);
    await this.vtRepo.remove(vt);
    return true;
  }

  private parseDuration(duration: string): number {
    const m = duration.match(/^(\d+)([smhd])$/i);
    if (!m) return 7 * 24 * 60 * 60 * 1000;
    const n = Number(m[1]);
    const unit = m[2].toLowerCase();
    switch (unit) {
      case 's':
        return n * 1000;
      case 'm':
        return n * 60 * 1000;
      case 'h':
        return n * 60 * 60 * 1000;
      case 'd':
        return n * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private generateTokenString(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
