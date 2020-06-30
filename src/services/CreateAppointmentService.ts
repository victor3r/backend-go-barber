import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

/**
 * Service:
 *  Responsável pela regra de negócio
 *  Não tem acesso direto aos dados de requisição e resposta
 *  Responsabilidade única (1 método execute)
 *  Ajuda a não ferir os pricípios do DRY
 */

// Dependency Inversion Principle (DIP): não é instanciado classes dentro dos services

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;

/**
 * Por padrão async functions retornam Promises, e o tipo da Promise é o que ela retorna quando estiver resolvida
 */
