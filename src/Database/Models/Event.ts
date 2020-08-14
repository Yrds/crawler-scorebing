import { DataTypes, Model } from 'sequelize';
import Game from './Game';

const eventAttributes = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING(255), allowNull: false, unique: false},
  time: { type: DataTypes.INTEGER, allowNull: false, unique: false },
  description: {type: DataTypes.STRING(255), allowNull: true, unique: false }
}

class Event extends Model {
  public static Game: any = null;
}

export const eventInit = (sequelize: any): void => {
  Event.init(eventAttributes,
    {
      sequelize,
      modelName: 'Event'
    }
  );

}

export const eventRelations = () => {
  Event.Game = Event.belongsTo(Game, {
    as: 'events',
    foreignKey: {
      name: 'GameId',
      allowNull: false
    }
  });
}

export default Event;
