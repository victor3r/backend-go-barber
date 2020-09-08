import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
  public async generate(user_id: string): Promise<UserToken> {}
}
