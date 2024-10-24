// src/models/DeliveryLocation.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class DeliveryLocation extends Model {
    public id!: number;
    public deliveryId!: number;
    public latitude!: number;
    public longitude!: number;
    public createdAt!: Date; // Adicionar a propriedade createdAt
    public updatedAt!: Date; // Adicionar a propriedade updatedAt
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
        timestamps: true, // Habilitar automaticamente os campos createdAt e updatedAt
    }
);

export default DeliveryLocation;