require('dotenv').config();

const {
  MONGO_DATABASE_NAME,
  MONGO_CONNECTION_STRING,
} = process.env;

const config = {
  mongodb: {
    url: MONGO_CONNECTION_STRING,
    databaseName: MONGO_DATABASE_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
