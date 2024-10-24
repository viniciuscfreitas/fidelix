// src/models/SpecialDate.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class SpecialDate extends Model {
    public id!: number;
    public name!: string;
    public startDate!: Date;
    public endDate!: Date;
    public multiplier!: number;
}

SpecialDate.init({
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
    multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'SpecialDate',
    tableName: 'SpecialDates',
    timestamps: false,
});

export default SpecialDate;