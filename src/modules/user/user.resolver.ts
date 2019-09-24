import bcrypt from "bcryptjs";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { MyContext } from "../../types/MyContext";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import {
  confirmUserPrefix
} from "../constants/redisPrefixes";
import { createBaseResolver } from "../shared/createBaseResolver";
import {
  CreateUserInput,
  UpdateUserInput
} from "./Inputs";
import { sendEmail } from "../../utils/sendMail";

const BaseResolver = createBaseResolver(
  "User",
  User,
  CreateUserInput,
  UpdateUserInput,
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {
  @Mutation(() => User, { name: `register` })
  async register(@Arg("data", () => CreateUserInput) data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await super.create({
      ...data,
      password: hashedPassword,
      approved: true
    });
    await sendEmail(data.email, await createConfirmationUrl(user.id));
    return user;
  }

  @Mutation(() => [User], { name: `registerMulti` })
  async registerMulti(
    @Arg("data", () => [CreateUserInput]) data: CreateUserInput[]
  ) {
    const users: User[] = [];
    for (let i = 0; i < data.length; i++) {
      users.push(await this.register(data[i]));
    }
    return users;
  }

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | Error> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return new Error("User not found.");
    }
    const { confirmed } = user;
    if (!confirmed) {
      return new Error("Please verify your email first.");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Error("Password is incorrect");
    }
    ctx.req.session!.userID = user.id;
    return user;
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);
    if (!userId) {
      return false;
    }
    const user = await User.findOne(userId);
    if (!user) {
      return false;
    }
    user.confirmed = true;
    user.save();
    redis.del(token);
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise<Boolean>((res, rej) =>
      ctx.req.session!.destroy(err => {
        if (err) {
          console.log(err);
          return rej(false);
        }
        ctx.res.clearCookie("qid");
        return res(true);
      })
    );
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx()
    ctx: MyContext
  ) {
    const { userID } = ctx.req.session!;
    return userID ? User.findOne(userID) : null;
  }
}
