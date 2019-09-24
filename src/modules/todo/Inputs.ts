import { Field, InputType } from "type-graphql";

@InputType()
class BaseInput {
  @Field()
  title: string;

  @Field({nullable: true})
  isDone?: string;
}

@InputType()
export class CreateTodoInput extends BaseInput {}

@InputType()
export class UpdateTodoInput extends BaseInput {}