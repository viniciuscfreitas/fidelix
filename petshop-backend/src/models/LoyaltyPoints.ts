// src/models/LoyaltyPoints.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class LoyaltyPoints extends Model {
    public id!: number;
    public customerId!: number;
    public points!: number;
}

LoyaltyPoints.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'LoyaltyPoints',
    tableName: 'loyalty_points',
});

export default LoyaltyPoints;