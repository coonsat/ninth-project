const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Course, {
          foreignKey: {
              fieldName: 'userId',
              allowNull: false
          }
      });
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A name is required'
        },
        notEmpty: {
          msg: 'Please provide a name'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The username you entered already exists'
      },
      validate: {
        notNull: {
          msg: 'A username is required'
        },
        notEmpty: {
          msg: 'Please provide a username'
        }
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      unique: {
        msg: 'A password is required'
      },
      notEmpty: {
        msg: 'Please provide a password'
      },
      len: {
        args: [8, 20],
        msg: 'The password should be between 8 and 20 characters long'
      }
    },
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if ( val === this.password ) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};