import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (pool) return pool;

  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('DATABASE_URL is not set. Database connection pool not initialized.');
      // Return a dummy object that throws when used, to avoid ERR_INVALID_URL during build
      return {
        execute: () => { throw new Error('Database pool called without DATABASE_URL'); },
        getConnection: () => { throw new Error('Database pool called without DATABASE_URL'); },
        end: async () => {},
      } as unknown as mysql.Pool;
    }
    throw new Error('DATABASE_URL is missing in environment variables');
  }

  const urlPattern = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?#\s"]+)/;
  const dbUrlClean = dbUrl.trim().replace(/^["']|["']$/g, '');
  const match = dbUrlClean.match(urlPattern);

  if (match) {
    const [, user, password, host, port, database] = match;
    pool = mysql.createPool({
      host,
      user,
      password: decodeURIComponent(password),
      port: parseInt(port),
      database: database.replace(/["']$/, ''), // Extra safety for trailing quotes
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  } else {
    pool = mysql.createPool(dbUrlClean);
  }

  return pool;
}

export const db = {
  execute: async (sql: string, params: any[] = []) => {
    return getPool().execute(sql, params);
  }
};

export async function query<T>(sql: string, params: any[] = []): Promise<T> {
  const [results] = await getPool().execute(sql, params);
  return results as T;
}

export async function queryOne<T>(sql: string, params: any[] = []): Promise<T | null> {
  const [results]: any = await getPool().execute(sql, params);
  return results.length > 0 ? results[0] as T : null;
}
