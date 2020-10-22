import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;
let provider: User;

describe('ListProviderDayAvailability', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );

    provider = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });
  });

  it('should be able to list the available hours in a day', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 19, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 19, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 19, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 19, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 9, 19, 16, 0, 0),
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: provider.id,
      day: 19,
      year: 2020,
      month: 10,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: true },
        { hour: 16, available: false },
        { hour: 17, available: true },
      ]),
    );
  });
});
