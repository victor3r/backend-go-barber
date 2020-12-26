import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateNotificationDTO {
  recipient: User;
  content: string;
}
