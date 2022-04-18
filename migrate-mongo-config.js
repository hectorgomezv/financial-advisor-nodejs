const {
  FINANCIAL_ADVISOR_MONGO_DATABASE_NAME,
  FINANCIAL_ADVISOR_MONGO_CONNECTION_STRING,
} = process.env;

const config = {
  mongodb: {
    url: FINANCIAL_ADVISOR_MONGO_CONNECTION_STRING,
    databaseName: FINANCIAL_ADVISOR_MONGO_DATABASE_NAME,
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
