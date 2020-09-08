import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const email = 'johndoe@example.com';

    await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password of a user who does not exist', async () => {
    const email = 'johndoe@example.com';

    await expect(
      sendForgotPasswordEmail.execute({ email }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const email = 'johndoe@example.com';

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});

// RED / GREEN / REFACTOR
