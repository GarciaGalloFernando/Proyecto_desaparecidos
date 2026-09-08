import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { adminRepository } from "../repositories/AdminRepository.js";

function safeAdmin(admin: any) {
  return { id:String(admin._id), nombre:admin.nombre, carnet:admin.carnet, email:admin.email, rol:admin.rol, estado:admin.estado,
    fechaCreacion:admin.fecha_creacion, actualizadoEn:admin.fecha_actualizacion };
}

export const list: RequestHandler = async (_req,res) => res.json((await adminRepository.findAll()).map(safeAdmin));

export const get: RequestHandler = async (req,res) => {
  const id=req.params.id;
  if(typeof id!=="string" || !isValidObjectId(id)) return res.status(400).json({message:"ID de usuario inválido."});
  const admin=await adminRepository.findById(id);
  if(!admin) return res.status(404).json({message:"Usuario no encontrado."});
  return res.json(safeAdmin(admin));
};

export const create: RequestHandler = async (req,res) => {
  const {nombre,carnet,email,password,rol="ADMIN"}=req.body;
  if(!nombre?.trim()||!carnet?.trim()||!email?.trim()||!password) return res.status(400).json({message:"Nombre, carnet, correo y contraseña son obligatorios."});
  if(String(password).length<8) return res.status(400).json({message:"La contraseña debe tener al menos 8 caracteres."});
  if(rol!=="ADMIN"&&rol!=="SUPER_ADMIN") return res.status(400).json({message:"Rol de usuario inválido."});
  const carnetN=String(carnet).trim(), emailN=String(email).trim().toLowerCase();
  if(await adminRepository.exists(carnetN,emailN)) return res.status(409).json({message:"Ya existe un usuario con ese carnet o correo electrónico."});
  const admin=await adminRepository.create({nombre:String(nombre).trim(),carnet:carnetN,email:emailN,passwordHash:await bcrypt.hash(String(password),10),rol});
  return res.status(201).json(safeAdmin(admin.toObject()));
};

export const update: RequestHandler = async (req,res) => {
  const id=req.params.id;
  if(typeof id!=="string" || !isValidObjectId(id)) return res.status(400).json({message:"ID de usuario inválido."});
  if(!await adminRepository.findById(id)) return res.status(404).json({message:"Usuario no encontrado."});
  const {nombre,carnet,email,password,rol}=req.body;
  if(!nombre?.trim()||!carnet?.trim()||!email?.trim()) return res.status(400).json({message:"Nombre, carnet y correo son obligatorios."});
  if(rol!=="ADMIN"&&rol!=="SUPER_ADMIN") return res.status(400).json({message:"Rol de usuario inválido."});
  if(password && String(password).length<8) return res.status(400).json({message:"La contraseña debe tener al menos 8 caracteres."});
  const carnetN=String(carnet).trim(), emailN=String(email).trim().toLowerCase();
  if(await adminRepository.exists(carnetN,emailN,id)) return res.status(409).json({message:"Ya existe otro usuario con ese carnet o correo electrónico."});
  const admin=await adminRepository.update(id,{nombre:String(nombre).trim(),carnet:carnetN,email:emailN,rol,...(password?{passwordHash:await bcrypt.hash(String(password),10)}:{})});
  return res.json(safeAdmin(admin));
};

export const changeStatus: RequestHandler = async (req,res) => {
  const id=req.params.id, {estado}=req.body;
  if(typeof id!=="string" || !isValidObjectId(id)) return res.status(400).json({message:"ID de usuario inválido."});
  if(estado!=="ACTIVO"&&estado!=="INACTIVO") return res.status(400).json({message:"Estado de usuario inválido."});
  if(String(req.user!._id)===id&&estado==="INACTIVO") return res.status(400).json({message:"No puedes desactivar tu propia cuenta."});
  const admin=await adminRepository.updateEstado(id,estado);
  if(!admin) return res.status(404).json({message:"Usuario no encontrado."});
  return res.json(safeAdmin(admin));
};
