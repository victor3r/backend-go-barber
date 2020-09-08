import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update the avatar of a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const avatarFilename = 'avatar.jpg';

    await updateUserAvatar.execute({ user_id: user.id, avatarFilename });

    expect(user.avatar).toBe(avatarFilename);
  });

  it('should be able to delete an old avatar when updating a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const oldAvatarFilename = 'oldAvatar.jpg';
    const newAvatarFilename = 'newAvatar.jpg';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: oldAvatarFilename,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: newAvatarFilename,
    });

    expect(deleteFile).toHaveBeenCalledWith(oldAvatarFilename);
    expect(user.avatar).toBe(newAvatarFilename);
  });

  it('should not be able to update the avatar of a user that does not exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const avatarFilename = 'avatar.jpg';

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
