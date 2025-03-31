
// backend/routes/generalRoutes.js

import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
    importarPerfiles,
    obtenerPerfiles,
    agregarPerfil,
    actualizarPerfil,
    eliminarPerfil,
  
    importarVidrios,
    obtenerVidrios,
    agregarVidrio,
    actualizarVidrio,
    eliminarVidrio,
  
    importarAccesorios,
    obtenerAccesorios,
    agregarAccesorio,
    actualizarAccesorio,
    eliminarAccesorio,
    importarProveedores,
    obtenerProveedores,
    agregarProveedor,
    actualizarProveedor,
    eliminarProveedor,
    importarCamaras,
    obtenerCamaras,
    agregarCamara,
    actualizarCamara,
    eliminarCamara
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

router.get("/proveedores", obtenerProveedores);
router.post("/proveedores", agregarProveedor);
router.put("/proveedores/:id", actualizarProveedor);
router.delete("/proveedores/:id", eliminarProveedor);
router.post("/proveedores/importar", upload.single("file"), importarProveedores);

export default router;
