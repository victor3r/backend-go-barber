import { hash, compare } from 'bcryptjs';

import IHashProvider from '../models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const hashedPayload = await hash(payload, 8);

    return hashedPayload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const matchedPayload = await compare(payload, hashed);

    return matchedPayload;
  }
}
