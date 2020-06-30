import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.findOne({
      where: { date },
    });

    return findAppointment;
  }
}

export default AppointmentsRepository;
