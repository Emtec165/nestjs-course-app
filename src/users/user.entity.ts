import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../reports/resport.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  afterInsert() {
    console.log("Inserted User with id: ", this.id);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log("Updated User with id: ", this.id);
  }

  @AfterRemove()
  afterRemove() {
    console.log("Removed User with id: ", this.id);
  }
}