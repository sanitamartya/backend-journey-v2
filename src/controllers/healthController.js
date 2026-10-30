// Health controller — GET /health handler
//
// KYUN: Load balancer, Kubernetes, monitoring tools isse puchhte hain:
// "server zinda hai?" Agar 200 nahi aaya, traffic nahi bhejenge.
//
// ABHI: Simple { status: 'ok' } — server process chal raha hai.
// AAGE: DB ping, Redis ping, disk check add karenge (deep health check).
// ============================================================
// check — health status return karo
// ============================================================
// INPUT:  req, res
// OUTPUT: 200 + { status: 'ok' }
// ============================================================
function check(req, res) {
  return res.status(200).json({ status: "ok" });
}

module.exports = { check };
