import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApproveInstructorDto,
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from './admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @Get('all-instructors')
  @Auth('ADMIN')
  async getAllInstructors() {
    return this.adminService.getAllInstructors();
  }

  @HttpCode(200)
  @Put('approve-instructor')
  @Auth('ADMIN')
  async aproveInstructor(@Body() body: ApproveInstructorDto) {
    return this.adminService.aproveInstructor(body.instructorId);
  }

  @HttpCode(200)
  @Put('delete-instructor')
  @Auth('ADMIN')
  async deleteInstructor(@Body() body: ApproveInstructorDto) {
    return this.adminService.deleteIntructor(body.instructorId);
  }

  @HttpCode(200)
  @Get('all-users')
  @Auth('ADMIN')
  async getAllUsers(@Query('limit') limit: string) {
    return this.adminService.getAllUsers(Number(limit));
  }

  @HttpCode(200)
  @Get('search-users')
  @Auth('ADMIN')
  async searchUser(@Query('email') email: string, @Query('limit') limit: string) {
    return this.adminService.searchUser(email, Number(limit));
  }

  @HttpCode(200)
  @Delete('delete-course')
  @Auth('ADMIN')
  async deleteCourse(@Query('courseId') courseId: string) {
    return this.adminService.deleteCourse(courseId);
  }

  @HttpCode(200)
  @Put('update-user-role')
  @Auth('ADMIN')
  async updateUserRole(@Body() body: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(body.userId, body.role);
  }

  @HttpCode(201)
  @Post('create-user')
  @Auth('ADMIN')
  async createUser(@Body() body: CreateUserDto) {
    return this.adminService.createUser(body.email, body.fullName, body.password, body.role);
  }

  @HttpCode(200)
  @Put('update-user')
  @Auth('ADMIN')
  async updateUser(@Body() body: UpdateUserDto) {
    return this.adminService.updateUser(
      body.userId,
      body.email,
      body.fullName,
      body.password,
      body.role,
    );
  }

  @HttpCode(200)
  @Delete('delete-user')
  @Auth('ADMIN')
  async deleteUser(@Body() body: DeleteUserDto) {
    return this.adminService.deleteUser(body.userId);
  }
}
