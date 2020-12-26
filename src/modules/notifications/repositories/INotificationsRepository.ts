import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
