import {AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Exclude } from "class-transformer";
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    // @Exclude()
    password:string;

    @AfterInsert()
    logInInsert(){
        console.log(`Inserted User with ID: ${this.id}`)
    }

    @AfterRemove()
    logInRemove(){
        console.log(`Removed User with ID: ${this.id}`)
    }

    @AfterUpdate()
    logInUpdate(){
        console.log(`Updated User with ID: ${this.id}`)
    }

}