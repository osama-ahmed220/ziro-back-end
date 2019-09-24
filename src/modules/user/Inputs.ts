import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";
import { IsUnique } from "../shared/uniqueValidation";
import { User } from "../../entity/User";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  firstName: string;

  @Field(() => String)
  @IsNotEmpty()
  lastName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsUnique(User)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}