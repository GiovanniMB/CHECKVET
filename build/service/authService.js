import jwt from "jsonwebtoken";

const permisos = {
    1: ['agenda','/mascota/:id','/mascotas','/formMascota','/'],  //veterinario
    2: ['/','/misMascotas','/mascota/:id'], //cliente
    3: ["*"] , //clinica
    4: ["*"] //empresa
};

export function authenticateToken(req, res, next) {
    const token = req.cookies?.myTokenName;
    if (!token) {
        return res.redirect("/login");
    }

    try {
        const user = jwt.verify(token, "your_secret_key");
        req.user = user;

        const rutaActual = req.path;
        const rutasPermitidas = permisos[user.idperfil];

        if (!rutasPermitidas || rutasPermitidas.length === 0) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        const tieneAcceso = rutasPermitidas.some(ruta => {
            if (ruta === "*") return user.idperfil === 3 || user.idperfil === 4; 
            if (ruta.includes(":id")) {
                const baseRuta = ruta.replace(":id", ""); 
                return rutaActual.startsWith(baseRuta);
            }
            if (ruta.endsWith("/*")) {
                const baseRuta = ruta.replace("/*", ""); 
                return rutaActual.startsWith(baseRuta);
            }
            return ruta === rutaActual; 
        });

        if (!tieneAcceso) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        next();
    } catch (error) {
        return res.redirect("/login");
    }
}