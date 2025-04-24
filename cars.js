export const handleCarRoutes = async (req, res, db) => {
  if (req.url === "/api/cars" && req.method === "GET") {
      const [rows] = await db.query("SELECT * FROM voitures");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
      return true;
  }

  if (req.url === "/api/cars/available" && req.method === "GET") {
      const [rows] = await db.query("SELECT * FROM voitures WHERE V_Dispo = 1");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
      return true;
  }

  if (req.url === "/api/cars/unavailable" && req.method === "POST") {
      const { model } = req.body;
      const [result] = await db.query("UPDATE cars SET V_Dispo = 0 WHERE model = ?", [model]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ affected: result.affectedRows }));
      return true;
  }

  return false;
};
