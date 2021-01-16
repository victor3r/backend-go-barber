import { startOfHour, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/**
 * Service:
 *  Responsável pela regra de negócio
 *  Não tem acesso direto aos dados de requisição e resposta
 *  Responsabilidade única (1 método execute)
 *  Ajuda a não ferir os princípios do DRY
 */

// Dependency Inversion Principle (DIP): não é instanciado classes dentro dos services

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const provider = await this.usersRepository.findById(provider_id);
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (!provider) {
      throw new AppError('Provider not found.');
    }

    if (provider_id === user_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm.',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${formattedDate}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;

/**
 * Por padrão async functions retornam Promises, e o tipo da Promise é o que ela retorna quando estiver resolvida
 */
