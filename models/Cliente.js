import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    empresa: { type: String, trim: true },
    email: { type: String, required: true, unique: tru, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true },
    direccion: {
        calle: { type: String, required: true, trim: true },
        ciudad: { type: String, required: true, trim: true },
        l: { type: String, required: true, trim: true },
        pais: { type: String, required: true, trim: true }
    },
    tipoCliente: { type: String, enum: ['particular', 'empresa'], required: true },
    obras: [{ type: ose.Schema.Types.ObjectId, ref: 'Obra' }],
    notas: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Cliente', clienteSchema);
