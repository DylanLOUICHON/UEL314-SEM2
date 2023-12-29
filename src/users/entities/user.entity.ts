
import { Table, Column, Model, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  firstname: string;

  @Column
  lastname: string;
}

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  }
];