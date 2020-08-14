import { Sequelize } from 'sequelize';
import Event, { eventInit, eventRelations } from './Models/Event';
import Game, { gameInit, gameRelations } from './Models/Game';

const database = (path: string) => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path
  });

  gameInit(sequelize);
  eventInit(sequelize);

  eventRelations();
  gameRelations();

  return sequelize;
}

export default database;
