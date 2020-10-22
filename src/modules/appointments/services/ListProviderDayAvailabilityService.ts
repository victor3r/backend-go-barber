import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const provider = await this.usersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError('Provider not found.');
    }

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => ({
      hour,
      available: !appointments.find(
        appointment => appointment.date.getHours() === hour,
      ),
    }));

    return availability;
  }
}
