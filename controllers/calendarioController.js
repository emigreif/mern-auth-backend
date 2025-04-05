import Obra from "../models/obra.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Obtener todos los eventos del calendario con opción de filtrar por obra o actividad
export const listarCalendarios = async (req, res) => {
  try {
    const { obraId, actividad } = req.query;
    let query = { user: req.user.id };

    if (obraId) {
      assertValidId(obraId, "Obra");
      query._id = obraId;
    }

    const obras = await Obra.find(query);
    if (!obras.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron obras con estos filtros" });
    }

    let eventos = [];
    obras.forEach((obra) => {
      const actividadesDisponibles = {
        medicion: {
          title: "Medición",
          date: obra.fechaMedicion,
          color: "blue"
        },
        compraVidrios: {
          title: "Compra Vidrios",
          date: obra.fechaCompraVidrios,
          color: "green"
        },
        compraPerfiles: {
          title: "Compra Perfiles",
          date: obra.fechaCompraPerfiles,
          color: "green"
        },
        compraAccesorios: {
          title: "Compra Accesorios",
          date: obra.fechaCompraAccesorios,
          color: "green"
        },
        inicioProduccion: {
          title: "Inicio Producción",
          date: obra.fechaInicioProduccion,
          color: "yellow"
        },
        inicioCorte: {
          title: "Inicio Corte",
          date: obra.fechaInicioCortePerfiles,
          color: "yellow"
        },
        inicioArmado: {
          title: "Inicio Armado",
          date: obra.fechaInicioArmado,
          color: "yellow"
        },
        inicioEnvidriado: {
          title: "Inicio Envidriado",
          date: obra.fechaEnvidriado,
          color: "yellow"
        },
        finProduccion: {
          title: "Fin Producción",
          date: obra.fechaFinProduccion,
          color: "orange"
        },
        entrega: {
          title: "Entrega",
          date: obra.fechaEntrega,
          color: "red"
        },
        montaje: {
          title: "Montaje",
          date: obra.fechaInicioMontaje,
          color: "red"
        },
        finalObra: {
          title: "Final de Obra",
          date: obra.fechaFinalObra,
          color: "gray"
        }
      };

      if (actividad && actividadesDisponibles[actividad]) {
        const item = actividadesDisponibles[actividad];
        if (item.date) {
          eventos.push({
            title: `${item.title} - ${obra.nombre}`,
            start: item.date,
            color: item.color
          });
        }
      } else {
        Object.values(actividadesDisponibles).forEach(({ title, date, color }) => {
          if (date) {
            eventos.push({
              title: `${title} - ${obra.nombre}`,
              start: date,
              color
            });
          }
        });
      }
    });

    res.json(eventos);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Generar automáticamente las fechas del calendario en base a la obra
export const generarCalendarioDesdeObra = async (req, res) => {
  try {
    const { obraId } = req.body;
    assertValidId(obraId, "Obra");

    const obra = await Obra.findOne({ _id: obraId, user: req.user.id });

    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    if (!obra.fechaEntrega) {
      return res
        .status(400)
        .json({ message: "La obra no tiene una fecha de entrega definida." });
    }

    const fechaBase = new Date(obra.fechaEntrega);

    obra.fechaMedicion = new Date(fechaBase.setDate(fechaBase.getDate() - 45));
    obra.fechaCompraVidrios = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaCompraPerfiles = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaCompraAccesorios = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaInicioProduccion = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaInicioCortePerfiles = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaInicioArmado = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaEnvidriado = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaFinProduccion = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaInicioMontaje = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
    obra.fechaFinalObra = new Date(fechaBase.setDate(fechaBase.getDate() + 5));

    await obra.save();
    res.json({ message: "Calendario generado correctamente", obra });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Obtener un calendario específico de una obra
export const obtenerCalendario = async (req, res) => {
  try {
    const { obraId } = req.params;
    assertValidId(obraId, "Obra");

    const obra = await Obra.findOne({ _id: obraId, user: req.user.id });

    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    res.json(obra);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar manualmente un calendario (fechas de la obra)
export const actualizarCalendario = async (req, res) => {
  try {
    const { obraId } = req.params;
    assertValidId(obraId, "Obra");

    const obraActualizada = await Obra.findOneAndUpdate(
      { _id: obraId, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!obraActualizada) {
      return res.status(404).json({ message: "Calendario no encontrado" });
    }

    res.json({ message: "Calendario actualizado correctamente", obra: obraActualizada });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Eliminar un calendario (borrar fechas de una obra)
export const eliminarCalendario = async (req, res) => {
  try {
    const { obraId } = req.params;
    assertValidId(obraId, "Obra");

    const obra = await Obra.findOne({ _id: obraId, user: req.user.id });

    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    obra.fechaMedicion = null;
    obra.fechaCompraVidrios = null;
    obra.fechaCompraPerfiles = null;
    obra.fechaCompraAccesorios = null;
    obra.fechaInicioProduccion = null;
    obra.fechaInicioCortePerfiles = null;
    obra.fechaInicioArmado = null;
    obra.fechaEnvidriado = null;
    obra.fechaFinProduccion = null;
    obra.fechaInicioMontaje = null;
    obra.fechaFinalObra = null;

    await obra.save();

    res.json({ message: "Calendario eliminado correctamente", obra });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
