import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';

    await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    expect(
      authenticateUser.execute({
        email: 'janedoe@example.com',
        password: userPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with an incorrect password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';

    await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    expect(
      authenticateUser.execute({
        email: userEmail,
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
