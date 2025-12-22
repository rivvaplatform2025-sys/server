import { UserResponseDto } from 'src/modules/users/application/dto/user-response.dto';
import { User } from 'src/modules/users/domain/entities/user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? undefined,
      bio: user.bio ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            email: user.organization.email,
            phoneNumber: user.organization.phoneNumber,
          }
        : null,
      userRoles:
        user.userRoles?.map((ur) => ({
          role: {
            id: ur.role.id,
            name: ur.role.name,
          },
        })) ?? [],
    };
  }
}
