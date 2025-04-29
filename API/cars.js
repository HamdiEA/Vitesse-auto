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

  return false;
};
