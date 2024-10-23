// src/models/Promotion.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Promotion extends Model {
    public id!: number;
    public name!: string;
    public startDate!: Date;
    public endDate!: Date;
    public bonusMultiplier!: number;
    public active!: boolean;
}

Promotion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        bonusMultiplier: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'Promotion',
        tableName: 'Promotions',
        timestamps: false,
    }
);

export default Promotion;