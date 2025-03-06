import Obra from "../models/Obra.js";

// 📌 Listar todos los calendarios con opción de filtrar por obra o actividad
export const listarCalendarios = async (req, res) => {
  try {
    const { obraId, actividad } = req.query;

    let query = {};

    // 📌 Filtrar por obra específica si obraId está presente
    if (obraId) {
      query._id = obraId;
    }

    // 📌 Obtener todas las obras que cumplen con el filtro
    const obras = await Obra.find(query);

    if (!obras.length) {
      return res.status(404).json({ message: "No se encontraron obras con estos filtros" });
    }

    // 📌 Formatear datos para enviarlos al frontend
    let eventos = [];

    obras.forEach((obra) => {
      if (!obra.calendario) return; // Si no tiene calendario, saltamos esta obra

      // Lista de actividades que se pueden filtrar
      const actividadesDisponibles = {
        medicion: { title: "Medición", date: obra.calendario.medicion, color: "blue" },
        compraVidrios: { title: "Compra Vidrios", date: obra.calendario.compraVidrios, color: "green" },
        compraPerfiles: { title: "Compra Perfiles", date: obra.calendario.compraPerfiles, color: "green" },
        compraAccesorios: { title: "Compra Accesorios", date: obra.calendario.compraAccesorios, color: "green" },
        inicioProduccion: { title: "Inicio Producción", date: obra.calendario.inicioProduccion, color: "yellow" },
        inicioCorte: { title: "Inicio Corte", date: obra.calendario.inicioCorte, color: "yellow" },
        inicioArmado: { title: "Inicio Armado", date: obra.calendario.inicioArmado, color: "yellow" },
        inicioEnvidriado: { title: "Inicio Envidriado", date: obra.calendario.inicioEnvidriado, color: "yellow" },
        finProduccion: { title: "Fin Producción", date: obra.calendario.finProduccion, color: "orange" },
        entrega: { title: "Entrega", date: obra.calendario.entrega, color: "red" },
        montaje: { title: "Montaje", date: obra.calendario.montaje, color: "red" },
        finalObra: { title: "Final de Obra", date: obra.calendario.finalObra, color: "gray" }
      };

      // 📌 Si hay un filtro de actividad, solo agregar esa actividad
      if (actividad && actividadesDisponibles[actividad]) {
        eventos.push({
          title: `${actividadesDisponibles[actividad].title} - ${obra.nombre}`,
          start: actividadesDisponibles[actividad].date,
          color: actividadesDisponibles[actividad].color
        });
      } else {
        // 📌 Si no hay filtro, agregar todas las actividades de la obra
        Object.values(actividadesDisponibles).forEach(({ title, date, color }) => {
          if (date) {
            eventos.push({
              title: `${title} - ${obra.nombre}`,
              start: date,
              color: color
            });
          }
        });
      }
    });

    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: "Error al listar los calendarios", error: error.message });
  }
};
