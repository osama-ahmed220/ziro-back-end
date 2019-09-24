import {
  Resolver
} from "type-graphql";
import { Todo } from "../../entity/Todo";
import { createBaseResolver } from "../shared/createBaseResolver";
import {
  CreateTodoInput,
  UpdateTodoInput
} from "./Inputs";

const BaseResolver = createBaseResolver(
  "Todo",
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  Todo
);

@Resolver(Todo)
export class TodoResolver extends BaseResolver {
}
