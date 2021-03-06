'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users', 
      'role', 
      {
        type: Sequelize.STRING, 
        allowNull: false,
        defaultValue: "basic"
       }
     );
   },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'User', 'role');
  }
};
