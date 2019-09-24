import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn
} from "typeorm";

@ObjectType()
@Entity()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  title: string;

  @Field(() => Boolean, {defaultValue: false})
  @Column("bool", { default: false })
  isDone: boolean;
}
