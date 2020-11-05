import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createAppointment: CreateAppointmentService;
let provider: User;
let user: User;

describe('CreateAppointment', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createAppointment = new CreateAppointmentService(
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

  it('should be able to create a new appointment', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    const appointment = await createAppointment.execute({
      date: new Date(2020, 9, 10, 13),
      provider_id: provider.id,
      user_id: user.id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider.id);
    expect(appointment.user_id).toBe(user.id);
    expect(appointment.date).toBeInstanceOf(Date);
  });

  it('should not be able to create a new appointment from a nonexistent provider', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 13),
        provider_id: 'nonexistent provider',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment from a nonexistent user', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 13),
        provider_id: provider.id,
        user_id: 'nonexistent user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    const appointmentDate = new Date(2020, 9, 10, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: provider.id,
      user_id: user.id,
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 11),
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with yourself', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 13),
        provider_id: provider.id,
        user_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 9, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 11, 7),
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 11, 18),
        provider_id: provider.id,
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
