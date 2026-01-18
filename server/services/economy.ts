import { UserRepository } from '../repositories/userRepository';

export class EconomyService {
  static async addCurrency(userId: string, amount: number): Promise&lt;number&gt; {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');

    user.currency += amount;
    await UserRepository.save(user);
    return user.currency;
  }

  static async spendCurrency(userId: string, amount: number): Promise&lt;boolean&gt; {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.currency &lt; amount) return false;

    user.currency -= amount;
    await UserRepository.save(user);
    return true;
  }
}
