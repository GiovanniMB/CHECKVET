import bcrypt from 'bcryptjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersFilePath = join(__dirname, '..', 'users.json');

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export function showRegister(req, res) {
  res.render('registro');
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  let users = [];
  if (await fileExists(usersFilePath)) {
    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    users = JSON.parse(fileContent);
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.send('Ya existe un usuario con ese correo.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });

  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
  res.send('Usuario registrado correctamente.');
}

export function showLogin(req, res) {
  res.render('login');
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileContent);

    const user = users.find(u => u.email === email);
    if (!user) return res.send('Usuario no encontrado');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Contraseña incorrecta');

    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al procesar el inicio de sesión');
  }
}

export function dashboard(req, res) {
  if (!req.session.user) return res.redirect('/');
  res.render('dashboard', { user: req.session.user });
}

export function logout(req, res) {
  req.session.destroy();
  res.redirect('/');
}
