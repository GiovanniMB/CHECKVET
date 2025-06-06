import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
    let connection;
    try {
        const { email, password } = req.body;
        connection = await getConnection();

        const [rows] = await connection.query(`
            SELECT u.password, u.idperfil, u.username, c.curp
            FROM usuario AS u
            JOIN cliente AS c ON u.id = c.idUsuario
            WHERE u.email = ?
        `, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { username: user.username, idperfil: user.idperfil, curp: user.curp },
            "your_secret_key",
            { expiresIn: "30d" }
        );

        res.cookie("myTokenName", token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/"
        });

        res.json({ message: "Login exitoso" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    } finally {
        if (connection) connection.release();
    }
});

export default router;