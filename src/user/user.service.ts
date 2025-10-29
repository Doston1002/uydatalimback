import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
// import { InjectStripe } from 'nestjs-stripe';
// import Stripe from 'stripe';
import { InterfaceEmailAndPassword, UpdateUserDto, ChangeRoleDto } from './user.interface';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) // @InjectStripe() private readonly stripeClient: Stripe,
  {}

  async byId(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async editPassword(dto: InterfaceEmailAndPassword, userId: string) {
    const { email, password } = dto;

    // ✅ SECURITY FIX: Faqat o'z email'ini o'zgartirishi mumkin
    const existUser = await this.userModel.findById(userId);
    if (!existUser) throw new UnauthorizedException('user_not_found');

    // Email tekshiruvi - faqat o'z emailini o'zgartirishi mumkin
    if (existUser.email !== email) {
      throw new UnauthorizedException('cannot_change_other_user_password');
    }

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    await this.userModel.findByIdAndUpdate(
      existUser._id,
      { $set: { password: hashPassword } },
      { new: true },
    );

    return 'Success';
  }

  async updateUser(body: UpdateUserDto, userID: string) {
    const { avatar, firstName, lastName, bio, birthday, job } = body;

    const user = await this.userModel.findByIdAndUpdate(
      userID,
      {
        $set: { fullName: `${firstName} ${lastName}`, avatar, bio, birthday, job },
      },
      { new: true },
    );

    return user;
  }

  async allTransactions(customerId: string) {
    // const transactions = await this.stripeClient.charges.list({
    //   customer: customerId,
    //   limit: 100,
    // });

    return {};
  }

  async myCourses(userId: string) {
    const user = await this.userModel.findById(userId).populate('courses').exec();

    return user.courses;
  }

  async changeRole(dto: ChangeRoleDto) {
    const { userId, role } = dto;

    const user = await this.userModel.findByIdAndUpdate(userId, { $set: { role } }, { new: true });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Role updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
