
// backend/routes/generalRoutes.js

import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
    importarPerfiles, obtenerCamaras,
    agregarCamara,
    importarCamaras, importarVidrios, obtenerAccesorios, agregarAccesorio, importarAccesorios, agregarPerfil, obtenerPerfiles, agregarVidrio, obtenerVidrios
} from "../controllers/generalController.js";

const router = express.Router();

router.get("/accesorios", obtenerAccesorios);
router.post("/accesorios", agregarAccesorio);
router.post("/accesorios/importar", upload.single("file"), importarAccesorios);


// 📌 Rutas de Perfiles Generales
router.get("/perfiles", obtenerPerfiles);
router.post("/perfiles", agregarPerfil);
router.post("/perfiles/importar", upload.single("file"), importarPerfiles);

// 📌 Rutas de Vidrios Generales
router.get("/vidrios", obtenerVidrios);
router.post("/vidrios", agregarVidrio);
router.post("/vidrios/importar", upload.single("file"), importarVidrios);

router.get("/camaras", obtenerCamaras);
router.post("/camaras", agregarCamara);
router.post("/camaras/importar", upload.single("file"), importarCamaras);
export default router;
