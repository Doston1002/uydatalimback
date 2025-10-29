import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.model';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from 'src/contact/dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument>) {}

  async create(createContactDto: CreateContactDto) {
    const contact = new this.contactModel(createContactDto);
    return contact.save();
  }

  async findAll(limit: number = 10, page: number = 1, type?: 'contact' | 'attendance') {
    const skip = (page - 1) * limit;

    // Filter query
    const filter = type ? { type } : {};

    const contacts = await this.contactModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await this.contactModel.countDocuments(filter);

    return {
      contacts: contacts.map(contact => this.transformContact(contact)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const contact = await this.contactModel.findById(id).exec();
    return contact ? this.transformContact(contact) : null;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactModel
      .findByIdAndUpdate(id, updateContactDto, { new: true })
      .exec();
    return contact ? this.transformContact(contact) : null;
  }

  async markAsRead(id: string) {
    const contact = await this.contactModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
    return contact ? this.transformContact(contact) : null;
  }

  async updateStatus(id: string, status: 'pending' | 'replied' | 'closed') {
    const contact = await this.contactModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    return contact ? this.transformContact(contact) : null;
  }

  async remove(id: string) {
    const contact = await this.contactModel.findByIdAndDelete(id).exec();
    return contact ? this.transformContact(contact) : null;
  }

  async getUnreadCount() {
    return this.contactModel.countDocuments({ isRead: false });
  }

  private transformContact(contact: ContactDocument) {
    return {
      id: contact._id.toString(),
      fullName: contact.fullName,
      phone: contact.phone,
      message: contact.message,
      teacherName: contact.teacherName,
      region: contact.region,
      district: contact.district,
      school: contact.school,
      schoolClass: contact.schoolClass,
      subject: contact.subject,
      teachingMethod: contact.teachingMethod,
      isAbsent: contact.isAbsent,
      type: contact.type || 'contact',
      isRead: contact.isRead,
      status: contact.status,
      createdAt: contact.createdAt || new Date(),
    };
  }
}
