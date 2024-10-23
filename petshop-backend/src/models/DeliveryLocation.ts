// src/models/DeliveryLocation.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class DeliveryLocation extends Model {
    public id!: number;
    public deliveryId!: number;
    public latitude!: number;
    public longitude!: number;
}

DeliveryLocation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        deliveryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'DeliveryLocation',
        tableName: 'DeliveryLocations',
    }
);

export default DeliveryLocation;