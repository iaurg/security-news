const { exec } = require("node:child_process");

const spinner = ["🟡", "🔴"];
let tickSpinner = 1;

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(_, stdout) {
    if (stdout.search("accepting connections") === -1) {
      tickSpinner = tickSpinner ? 0 : 1;
      process.stdout.write(`\r ${spinner[tickSpinner]} Aguardando conexão`);
      setTimeout(() => checkPostgres(), 100);
      return;
    }

    process.stdout.write("\n 🟢 Postgres está aceitando conexões");
  }
}

checkPostgres();
