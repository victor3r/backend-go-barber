import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let provider: User;
let user: User;

describe('ListProviderMonthAvailability', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );

    provider = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    user = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123123',
    });
  });

  it('should be able to list the available days in a month', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 20, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: provider.id,
      year: 2020,
      month: 10,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: false },
        { day: 20, available: true },
      ]),
    );
  });
});
