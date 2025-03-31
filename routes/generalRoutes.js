
// backend/routes/generalRoutes.js

import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
    importarPerfiles, obtenerCamaras,
    agregarCamara,
    importarCamaras, importarVidrios, obtenerAccesorios, agregarAccesorio, importarAccesorios, agregarPerfil,actualizarAccesorio,eliminarAccesorio,actualizarPerfil,eliminarPerfil,actualizarVidrio,eliminarVidrio,actualizarCamara,eliminarCamara, obtenerPerfiles, agregarVidrio, obtenerVidrios
} from "../controllers/generalController.js";

const router = express.Router();

router.get("/accesorios", obtenerAccesorios);
router.post("/accesorios", agregarAccesorio);
router.put("/accesorios/:id", actualizarAccesorio);
router.delete("/accesorios/:id", eliminarAccesorio);
router.post("/accesorios/importar", upload.single("file"), importarAccesorios);


// 📌 Rutas de Perfiles Generales
router.get("/perfiles", obtenerPerfiles);
router.post("/perfiles", agregarPerfil);
router.put("/perfiles/:id", actualizarPerfil);
router.delete("/perfiles/:id", eliminarPerfil);
router.post("/perfiles/importar", upload.single("file"), importarPerfiles);

// 📌 Rutas de Vidrios Generales
router.get("/vidrios", obtenerVidrios);
router.post("/vidrios", agregarVidrio);
router.put("/vidrios/:id", actualizarVidrio);
router.delete("/vidrios/:id", eliminarVidrio);
router.post("/vidrios/importar", upload.single("file"), importarVidrios);

router.get("/camaras", obtenerCamaras);
router.post("/camaras", agregarCamara);
router.put("/camaras/:id", actualizarCamara);
router.delete("/camaras/:id", eliminarCamara);
router.post("/camaras/importar", upload.single("file"), importarCamaras);
export default router;
