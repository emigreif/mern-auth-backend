import mongoose from 'mongoose';

const ObraSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  direccion: { type: String, required: true, trim: true },
  contacto: { type: String, required: true, trim: true },
  mapa: { type: String, trim: true },
  fechaEntrega: { type: Date, required: true }, // Fecha de entrega pactada
  importeConFactura: { type: Number, required: true, default: 0 },
  importeSinFactura: { type: Number, required: true, default: 0 },
  importeTotal: { type: Number, required: true, default: 0 },
  indiceActualizacionSaldo: { type: Number, default: 0 },
  perfilesPresupuesto: [
    {
      codigo: { type: String },
      descripcion: { type: String },
      cantidad: { type: Number },
      precio: { type: Number }
    }
  ],
  vidriosPresupuesto: [
    {
      codigo: { type: String },
      descripcion: { type: String },
      cantidad: { type: Number },
      precio: { type: Number }
    }
  ],
  accesoriosPresupuesto: [
    {
      codigo: { type: String },
      descripcion: { type: String },
      cantidad: { type: Number },
      precio: { type: Number }
    }
  ],
  // Campos calculados a partir de fechaEntrega
  fechaInicioCortePerfiles: { type: Date },
  fechaInicioArmado: { type: Date },
  fechaEnvidriado: { type: Date },
  fechaInicioMontaje: { type: Date },
  fechaMedicion: { type: Date },
  // Campos de control
  ordenProduccionAprobada: { type: Boolean, default: false },
  finalObra: { type: Boolean, default: false },
  estado: {
    perfiles: { type: String, enum: ['pendiente', 'proximo', 'cumplido'], default: 'pendiente' },
    vidrios: { type: String, enum: ['pendiente', 'proximo', 'cumplido'], default: 'pendiente' },
    accesorios: { type: String, enum: ['pendiente', 'proximo', 'cumplido'], default: 'pendiente' },
    produccion: { type: String, enum: ['pendiente', 'proximo', 'cumplido'], default: 'pendiente' },
    medicion: { type: String, enum: ['pendiente', 'proximo', 'cumplido'], default: 'pendiente' },
    aprobada: { type: String, enum: ['pendiente', 'proximo', 'cumplido'], default: 'pendiente' }
  },
  // El saldo se actualiza a partir de cálculos externos
  saldo: { type: String, enum: ['Con saldo a cobrar', 'Pagada'], default: 'Con saldo a cobrar' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }, { timestamps: true });
  
// Pre-save hook para calcular las fechas derivadas de fechaEntrega
ObraSchema.pre('save', function(next) {
  if (this.isModified('fechaEntrega') || this.isNew) {
    const fechaEntrega = this.fechaEntrega;
    if (fechaEntrega) {
      // Fecha de inicio de corte de perfiles: fechaEntrega - 30 días
      this.fechaInicioCortePerfiles = new Date(fechaEntrega.getTime() - 30 * 24 * 60 * 60 * 1000);
      // Fecha de inicio de armado: fechaEntrega - 25 días
      this.fechaInicioArmado = new Date(fechaEntrega.getTime() - 25 * 24 * 60 * 60 * 1000);
      // Fecha de envidriado: fechaEntrega - 20 días
      this.fechaEnvidriado = new Date(fechaEntrega.getTime() - 20 * 24 * 60 * 60 * 1000);
      // Fecha de inicio de montaje: por defecto igual a fechaEntrega (se puede modificar)
      if (!this.fechaInicioMontaje) {
        this.fechaInicioMontaje = fechaEntrega;
      }
      // Fecha de medición: fechaEntrega - 45 días
      this.fechaMedicion = new Date(fechaEntrega.getTime() - 45 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

export default mongoose.model('Obra', ObraSchema);
