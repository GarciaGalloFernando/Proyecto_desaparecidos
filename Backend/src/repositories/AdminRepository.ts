import { AdminModel } from "../models/Admin.js";

export const adminRepository = {
  findByCarnet: (carnet: string) => AdminModel.findOne({ carnet: carnet.trim() }).select("+passwordHash"),
  findById: (id: string) => AdminModel.findById(id).lean(),
  findAll: () => AdminModel.find().sort({ nombre: 1 }).lean(),
  exists: (carnet: string, email: string, excludeId?: string) => {
    const query: Record<string, unknown> = { $or: [{ carnet }, { email }] };
    if (excludeId) query._id = { $ne: excludeId };
    return AdminModel.exists(query);
  },
  create: (data: { nombre:string; carnet:string; email:string; passwordHash:string; rol:"ADMIN"|"SUPER_ADMIN" }) => AdminModel.create(data),
  update: (id:string, data:{nombre:string;carnet:string;email:string;rol:"ADMIN"|"SUPER_ADMIN";passwordHash?:string}) => {
    const { passwordHash, ...rest } = data;
    const update: Record<string, unknown> = { ...rest, fecha_actualizacion: new Date() };
    if (passwordHash) update.passwordHash = passwordHash;
    return AdminModel.findByIdAndUpdate(id, { $set: update }, { new:true, runValidators:true }).lean();
  },
  updateEstado: (id:string, estado:"ACTIVO"|"INACTIVO") =>
    AdminModel.findByIdAndUpdate(id, { $set:{ estado, fecha_actualizacion:new Date() } }, { new:true, runValidators:true }).lean(),
};
