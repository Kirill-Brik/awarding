export default ({ env }) => ({
	connection: {
		client: 'postgres',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 5432),
			database: env('DATABASE_NAME', 'strapi'),
			user: env('DATABASE_USERNAME', 'manager'),
			password: env('DATABASE_PASSWORD', 'admin'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
