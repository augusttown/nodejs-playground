/**
 *
 */
import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({
    timestamps: false,
    freezeTableName: true,
    schema: 'dbo',
    tableName: 'person'
})
export class Person extends Model<Person> {
    @Column({ type: DataType.INTEGER, primaryKey: true })
    id: number;
    @Column(DataType.STRING)
    first_name: string;
    @Column(DataType.STRING)
    last_name: string;
    @Column(DataType.INTEGER)
    age: number;
}

