const bcrypt = require('bcrypt');
const saltRounds = 8;

async function guardarVeterinario(datos) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insertar persona
    const [resultPersona] = await connection.query(
      `INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, telefono) VALUES (?, ?, ?, ?)`,
      [datos.nombre, datos.apellidoP, datos.apellidoM, datos.telefono]
    );
    const idPersona = resultPersona.insertId;

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(datos.password, saltRounds);

    // Insertar usuario (idperfil = 1)
    const [resultUsuario] = await connection.query(
      `INSERT INTO usuario (email, username, password, idperfil) VALUES (?, ?, ?, ?)`,
      [datos.email, datos.username, passwordHash, 1]
    );
    const idUsuario = resultUsuario.insertId;

    // Insertar veterinario
    await connection.query(
      `INSERT INTO veterinario (cedula, idPersona, idClinica, idUsuario) VALUES (?, ?, ?, ?)`,
      [datos.cedula, idPersona, datos.idClinica, idUsuario]
    );

    await connection.commit();
    connection.release();

    return { success: true };

  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}
