import express from "express";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = 3000;

// Connect to PostgreSQL
const db = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
});

db.connect();

// Express setup
app.set("view engine", "ejs");
app.use(express.static("public"));

const limit = 10;

app.get("/", async (req, res) => {

    try {
        // Pagination
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const offset = (page - 1) * limit;

        // Query 1: Count customers
        const resultCount = await db.query(
            "SELECT count(*) FROM customers"
        );

        const totalCustomers = Number(resultCount.rows[0].count);
        const totalPages = Math.ceil(totalCustomers / limit);

        // Query 2: Get customers with pagination
        const resultCustomers = await db.query(
            "SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        // Query 3: Total revenue
        const resultRevenue = await db.query(
            "SELECT sum(saleamount) FROM sales"
        );

        // Query 4: Sales records with product names
        const resultSales = await db.query(`
            SELECT products.name, sales.quantity, sales.saleamount
            FROM sales
            LEFT JOIN products ON sales.productid = products.id
            ORDER BY sales.id ASC
        `);

        // Query 5: Count orders
        const resultOrders = await db.query(
            "SELECT count(quantity) FROM orders"
        );

        // Query 6: Count issues
        const resultIssuesCount = await db.query(
            "SELECT count(id) FROM alerts WHERE type = 'issues'"
        );

        // Query 7: Get issues
        const resultIssues = await db.query(
            "SELECT * FROM alerts WHERE type = 'issues'"
        );

        // Query 8: Count notifications
        const resultNotificationsCount = await db.query(
            "SELECT count(id) FROM alerts WHERE type = 'notifications'"
        );

        // Query 9: Get notifications
        const resultNotifications = await db.query(
            "SELECT * FROM alerts WHERE type = 'notifications'"
        );

        // Query 10: Get tasks
        const resultTasks = await db.query(
            "SELECT * FROM alerts WHERE type = 'tasks'"
        );

        // Send data to the dashboard
        res.render("index.ejs", {
            dashboardData: {
                username: "UTRGV Vaqueros",
                revenue: Number(resultRevenue.rows[0].sum),
                totalCustomers: totalCustomers,
                orders: Number(resultOrders.rows[0].count),
                issuesCount: Number(resultIssuesCount.rows[0].count),
                notificationsCount: Number(resultNotificationsCount.rows[0].count),
                customers: resultCustomers.rows,
                sales: resultSales.rows,
                issues: resultIssues.rows,
                notifications: resultNotifications.rows,
                tasks: resultTasks.rows,
                currentPage: page,
                totalPages: totalPages
            }
        });

    } catch (err) {
        console.log("Database error:", err);

        res.status(500).send("Error retrieving dashboard data.");
    }

});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});