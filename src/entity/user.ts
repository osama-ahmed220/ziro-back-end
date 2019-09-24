import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  name: string;

  @Column("bool", { default: false })
  confirmed: boolean;
}