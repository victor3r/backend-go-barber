import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

import User from '../infra/typeorm/entities/User';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const email = 'johndoe@example.com';

    let user = await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({ token, password: '123123' });

    user = (await fakeUsersRepository.findById(user.id)) as User;

    expect(user.password).toBe('123123');
    expect(generateHash).toHaveBeenCalledWith('123123');
  });

  it('should not be able to reset the password with a nonexistent token', async () => {
    await expect(
      resetPassword.execute({ token: 'nonexistent token', password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with a nonexistent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'nonexistent user',
    );

    await expect(
      resetPassword.execute({ token, password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with an expired token', async () => {
    const email = 'johndoe@example.com';

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      customDate.setHours(customDate.getHours() + 3);

      return customDate.getTime();
    });

    await expect(
      resetPassword.execute({ token: userToken.token, password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

// RED / GREEN / REFACTOR
