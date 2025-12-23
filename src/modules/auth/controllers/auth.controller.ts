import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Param,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../application/dto/register.dto';
import { LoginDto } from '../application/dto/login.dto';
//import { RefreshTokenDto } from '../application/dto/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CurrentUser,
  IAuthenticatedRequest,
} from '../decorators/current-user.decorator';
import {
  OrganizationRequestDto,
  OrganizationResponseDto,
} from '../application/dto/organization.dto';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
      dto.roleId,
    );
    return { id: user.id, email: user.email };
  }

  @Post('create-organization/:email')
  @ApiOperation({
    summary: 'Create Organization based on the user previously created',
  })
  async createOrganization(
    @Param('email') email: string,
    @Body() dto: OrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    console.log('Controller Profile', email);
    return await this.authService.createOrganisation(email, dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email/password' })
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto.email, dto.password);
    // ACCESS TOKEN
    res.cookie('rivva_access_token', user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 30, // 30 mins
    });

    // REFRESH TOKEN
    res.cookie('rivva_refresh_token', user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    return user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Use refresh token to obtain new tokens' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      typeof req.cookies?.rivva_refresh_token === 'string'
        ? req.cookies.rivva_refresh_token
        : null;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken } = await this.authService.refresh(refreshToken);

    res.cookie('rivva_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 30,
    });

    return { success: true };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('rivva_access_token', { path: '/' });
    res.clearCookie('rivva_refresh_token', { path: '/' });

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  me(@CurrentUser() user: IAuthenticatedRequest) {
    return user;
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  async verifyEmail(@Body() body: { token: string }) {
    await this.authService.verifyEmail(body.token);
    return { success: true };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email);
    return { success: true };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { success: true };
  }

  // @Post('logout')
  // @ApiOperation({ summary: 'Logout and revoke refresh token' })
  // async logout(@Body() body: { refreshToken: string }) {
  //   await this.authService.revokeRefreshToken(body.refreshToken);
  //   return { success: true };
  // }
}
