import { DataTypes, Model } from 'sequelize';
import Event from './Event';

const gameAttributes = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  league: { type: DataTypes.STRING(255), allowNull: false },
  kickOffTime: { type: DataTypes.STRING(255), allowNull: false },
  homeTeam: { type: DataTypes.STRING(255), allowNull: false },
  result: { type: DataTypes.STRING(255), allowNull: false },
  awayTeam: { type: DataTypes.STRING(255) },
  halfResult: { type: DataTypes.STRING(255) },
  initialHGC: { type: DataTypes.STRING(255) }
}

class Game extends Model {
  public static Events: any = null;


}

export const gameInit = (sequelize: any): void => {
  Game.init(gameAttributes,
    {
      sequelize,
      modelName: 'Game'
    }
  );
}

export const gameRelations = () => {
  Game.Events = Game.hasMany(Event, { as : 'events'} );
}

export default Game;
