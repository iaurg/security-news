import database from "infra/database.js";

test("Any method different from GET or POST returns 405 Not Allowed", async () => {
  const responseDelete = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "DELETE",
    },
  );

  expect(responseDelete.status).toBe(405);

  const responsePut = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });

  expect(responsePut.status).toBe(405);

  const responsePatch = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PATCH",
  });

  expect(responsePatch.status).toBe(405);
});

test("Any method different from GET or POST don't open extra database connections", async () => {
  const responseDelete = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "DELETE",
    },
  );

  expect(responseDelete.status).toBe(405);

  const databaseOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  const databaseOpenedConnectionsParsed =
    databaseOpenedConnections.rows[0].count;

  expect(databaseOpenedConnectionsParsed).toEqual(1);
});
