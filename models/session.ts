import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({
    timestamps: false,
    freezeTableName: true,
    schema: 'dbo',
    tableName: 'session'
})
export class Session extends Model<Session> {
    @Column({ type: DataType.STRING(32), primaryKey: true })
    sid: string;
    @Column(DataType.DATE)
    expires: Date;
    @Column(DataType.STRING(50000))
    data: string;
}