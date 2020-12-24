import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let provider: User;
let user: User;

describe('ListProviderAppointments', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listProviderAppointments = new ListProviderAppointmentsService(
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

  it('should not be able to list the appointments in a day from a nonexistent provider', async () => {
    await expect(
      listProviderAppointments.execute({
        provider_id: 'nonexistent-provider',
        day: 19,
        year: 2020,
        month: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to list the appointments in a day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      user_id: user.id,
      date: new Date(2020, 9, 19, 14, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: provider.id,
      day: 19,
      year: 2020,
      month: 10,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
