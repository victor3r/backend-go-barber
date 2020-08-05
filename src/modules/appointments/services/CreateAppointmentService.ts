import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/**
 * Service:
 *  Responsável pela regra de negócio
 *  Não tem acesso direto aos dados de requisição e resposta
 *  Responsabilidade única (1 método execute)
 *  Ajuda a não ferir os pricípios do DRY
 */

// Dependency Inversion Principle (DIP): não é instanciado classes dentro dos services

interface IRequest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;

/**
 * Por padrão async functions retornam Promises, e o tipo da Promise é o que ela retorna quando estiver resolvida
 */
