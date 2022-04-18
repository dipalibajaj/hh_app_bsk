import { Repository } from '../repository';
import { User, UserModel } from './user.model';

export class UserRepository extends Repository {
  constructor() {
    super();
    console.log('🍀 UserRepository Created');
  }
  redisUserIdKey = 'userId';

  async getUserById(
    requestingUserId: string,
    lean: boolean = false,
  ): Promise<User | undefined> {
    const cachedUser = await this._getFromRedis(
      `${this.redisUserIdKey}:${requestingUserId}`,
    );
    if (cachedUser) return JSON.parse(cachedUser);

    const user = await UserModel.findOne({ uid: requestingUserId }, null, {
      lean: lean,
    }).exec();

    if (user) {
      await this._saveToRedis(`${this.redisUserIdKey}:${requestingUserId}`, user);
    }
    return user || undefined;
  }

  async getUsers({
    uid,
    id,
    email,
    phone_number,
    username,
    limit = 10,
    page = 1,
    lean = false,
  }: GetUserParams): Promise<User[]> {
    let query = UserModel.find();
    if (uid) query = query.where('uid').equals(uid);
    if (id) query = query.where('_id').equals(id);
    if (email) query = query.where('email').equals(email);
    if (phone_number) query = query.where('phone_number').equals(phone_number);
    if (username) query = query.where('username').equals(phone_number);
    if (lean) query = query.lean();

    return query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async createNewUser(data: any): Promise<User | undefined> {
    let user = await this.getUserById(data.uid);
    if (user) return undefined;
    user = await UserModel.create(data);
    if (!user) return undefined;

    await this._saveToRedis(`${this.redisUserIdKey}:${user.uid}`, user);
    return user;
  }

  async updateUserDetails(
    updatedUserDetail: any,
    uid: string,
    lean: boolean = false,
  ): Promise<User | undefined> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { uid: uid },
      updatedUserDetail,
      { new: true, lean: lean },
    ).exec();
    if (!updatedUser) return undefined;

    await this._saveToRedis(`${this.redisUserIdKey}:${updatedUser.uid}`, updatedUser);
    return updatedUser;
  }

  async deleteUser(uid: string): Promise<User | undefined> {
    const user = await UserModel.findOneAndDelete(
      { uid: uid },
      { new: true, lean: true },
    ).exec();
    if (!user) return undefined;
    await this._removeFromRedis(`${this.redisUserIdKey}:${uid}`);
    return user;
  }

  async getOrCreateUserByEmail(email: string): Promise<User | undefined> {
    let user = (await this.getUsers({ email: email })).shift();
    if (!user) {
      // TODO: create a user in firebase, and get uid
      user = await this.createNewUser({ uid: ' ', email: email, name: ' ' });
    }
    return user;
  }
}
interface GetUserParams {
  uid?: string;
  id?: string;
  email?: string;
  phone_number?: string;
  username?: string;
  limit?: number;
  page?: number;
  lean?: boolean;
}