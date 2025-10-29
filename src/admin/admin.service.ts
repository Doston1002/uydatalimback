import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as SendGrid from '@sendgrid/mail';
import { Model } from 'mongoose';
import { genSalt, hash } from 'bcryptjs';
// import { InjectStripe } from 'nestjs-stripe';
import { Course, CourseDocument } from 'src/course/course.model';
import { Instructor, InstructorDocument } from 'src/instructor/instructor.model';
import { User, UserDocument } from 'src/user/user.model';
// import Stripe from 'stripe';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    // @InjectStripe() private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  async getAllInstructors() {
    const instructors = await this.instructorModel.find().populate('author').exec();

    return instructors.map(instructor => this.getSpecificField(instructor));
  }

  async aproveInstructor(instructorId: string) {
    const instructor = await this.instructorModel.findByIdAndUpdate(
      instructorId,
      {
        $set: { approved: true },
      },
      { new: true },
    );

    const user = await this.userModel.findById(instructor.author);

    // const account = await this.stripeClient.accounts.create({
    //   type: 'express',
    //   country: 'US',
    //   email: user.email,
    //   capabilities: {
    //     card_payments: { requested: true },
    //     transfers: { requested: true },
    //   },
    // });

    // const accountLinks = await this.stripeClient.accountLinks.create({
    //   account: account.id,
    //   refresh_url: 'https://uydatalim.uzedu.uz',
    //   return_url: 'https://uydatalim.uzedu.uz',
    //   type: 'account_onboarding',
    // });

    // await this.userModel.findByIdAndUpdate(
    //   instructor.author,
    //   { $set: { role: 'INSTRUCTOR', instructorAccountId: account.id } },
    //   { new: true },
    // );

    const emailData = {
      to: user.email,
      subject: 'Successfully approved',
      from: 'dilbarxudoyberdiyeva71@gmail.com',
      html: `
        <p>Hi dear ${
          user.fullName
        }, you approved to our platform like Instructor, follow the bellow steps.</p>
				<a href="${1111}">Full finish your instructor account</a>
			`,
    };

    await SendGrid.send(emailData);

    return 'Success';
  }

  async deleteIntructor(instructorId: string) {
    const instructor = await this.instructorModel.findByIdAndUpdate(
      instructorId,
      {
        $set: { approved: false },
      },
      { new: true },
    );

    await this.userModel.findByIdAndUpdate(
      instructor.author,
      { $set: { role: 'USER' } },
      { new: true },
    );

    return 'Success';
  }

  async getAllUsers(limit: number) {
    const users = await this.userModel.find().limit(limit).sort({ createdAt: -1 }).exec();

    return users.map(user => this.getUserSpecificFiled(user));
  }

  async searchUser(email: string, limit: number) {
    let users: UserDocument[];
    if (email) {
      users = await this.userModel.find({}).exec();
    } else {
      users = await this.userModel.find({}).limit(limit).exec();
    }
    const searchedUser = users.filter(
      user => user.email.toLowerCase().indexOf(email.toLowerCase()) !== -1,
    );

    return searchedUser.map(user => this.getUserSpecificFiled(user));
  }

  async deleteCourse(courseId: string) {
    const courseAuthor = await this.courseModel.findById(courseId);
    await this.instructorModel.findOneAndUpdate(
      { author: courseAuthor.author },
      { $pull: { courses: courseId } },
      { new: true },
    );
    await this.courseModel.findByIdAndRemove(courseId, { new: true }).exec();
    const courses = await this.courseModel.find().exec();
    return courses.map(course => this.getSpecificFieldCourse(course));
  }

  async updateUserRole(userId: string, role: 'ADMIN' | 'INSTRUCTOR' | 'USER') {
    const user = await this.userModel.findByIdAndUpdate(userId, { $set: { role } }, { new: true });

    if (!user) {
      throw new Error('User not found');
    }

    return this.getUserSpecificFiled(user);
  }

  async createUser(
    email: string,
    fullName: string,
    password: string,
    role?: 'ADMIN' | 'INSTRUCTOR' | 'USER',
  ) {
    const existUser = await this.userModel.findOne({ email });

    if (existUser) {
      throw new BadRequestException('Email allaqachon mavjud');
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await this.userModel.create({
      email,
      fullName,
      password: hashedPassword,
      role: role || 'USER',
    });

    return this.getUserSpecificFiled(user);
  }

  async updateUser(
    userId: string,
    email?: string,
    fullName?: string,
    password?: string,
    role?: 'ADMIN' | 'INSTRUCTOR' | 'USER',
  ) {
    const updateData: any = {};

    // Email o'zgarganda, boshqa userda mavjud emasligini tekshirish
    if (email) {
      const existUser = await this.userModel.findOne({
        email,
        _id: { $ne: userId }, // O'zidan boshqa userlarni tekshirish
      });

      if (existUser) {
        throw new BadRequestException('Email already exists');
      }

      updateData.email = email;
    }

    if (fullName) updateData.fullName = fullName;
    if (role) updateData.role = role;

    if (password) {
      const salt = await genSalt(10);
      updateData.password = await hash(password, salt);
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.getUserSpecificFiled(user);
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  getSpecificField(instructor: InstructorDocument) {
    return {
      approved: instructor.approved,
      socialMedia: instructor.socialMedia,
      _id: instructor._id,
      author: {
        fullName: instructor.author.fullName,
        email: instructor.author.email,
        job: instructor.author.job,
      },
    };
  }

  getUserSpecificFiled(user: UserDocument) {
    return {
      email: user.email,
      fullName: user.fullName,
      id: user._id,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  getSpecificFieldCourse(course: CourseDocument) {
    return {
      title: course.title,
      previewImage: course.previewImage,
      isActive: course.isActive,
      language: course.language,
      _id: course._id,
    };
  }
}
