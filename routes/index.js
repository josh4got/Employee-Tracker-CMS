const express = require("express");
const employeesRouter = require("./employees");
const rolesRouter = require("./roles");
const departmentsRouter = require("./departments");

const app = express();

app.use("/api/employees", employeesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/departments", departmentsRouter);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
