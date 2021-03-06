import { HydratedDocument, Types } from 'mongoose';
import { User } from '../models/user.model';
import type { userTheme } from '../models/user.model';

export class UserDto {
  readonly id: Types.ObjectId;
  readonly email: string;
  readonly isActivated: boolean;
  readonly registrationDate: Date;
  readonly name: string;
  readonly avatar?: string;
  readonly userTheme: userTheme;

  constructor(model: HydratedDocument<User>) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.registrationDate = model.creationDate;
    this.userTheme = model.userTheme;
    this.avatar = model.avatar;
  }
}
