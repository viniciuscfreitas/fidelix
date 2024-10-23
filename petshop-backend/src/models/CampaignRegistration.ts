// src/models/CampaignRegistration.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class CampaignRegistration extends Model {
    public id!: number;
    public customerId!: number;
    public campaignName!: string;
    public registeredAt!: Date;
}

CampaignRegistration.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    campaignName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registeredAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'CampaignRegistration',
    tableName: 'CampaignRegistrations',
    timestamps: true, // Habilitar timestamps automáticos
});

export default CampaignRegistration;
