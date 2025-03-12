import { envs } from './config/envs';
import { PostgresDatabase } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {
  await PostgresDatabase.connect({
    dbName: envs.DB_NAME,
    dbUser: envs.DB_USER,
    dbPassword: envs.DB_PASSWORD,
    dbHost: envs.DB_HOST,
    dbPort: envs.DB_PORT,
    synchronize: envs.SYNCHRONIZE,
    logging: envs.LOGGING,
  
  })
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}