import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a user', async () => {
    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';

    const user = await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    const response = await authenticateUser.execute({
      email: userEmail,
      password: userPassword,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a user that does not exist', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with an incorrect password', async () => {
    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';

    await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    await expect(
      authenticateUser.execute({
        email: userEmail,
        password: 'incorrect-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
