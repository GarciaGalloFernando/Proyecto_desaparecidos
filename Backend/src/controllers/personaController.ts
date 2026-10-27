import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

import { historialCambioRepository } from "../repositories/HistorialCambioRepository.js";
import { personaRepository } from "../repositories/PersonaRepository.js";

function serializarPersona(persona: any, incluirReportante = false) {
  const {
    _id,
    __v,
    nombreReportante,
    documentoReportante,
    parentesco,
    correoReportante,
    contactoReportante,
    ...rest
  } = persona;

  const result: Record<string, unknown> = {
    id: String(_id),
    ...rest,
  };

  if (incluirReportante) {
    Object.assign(result, {
      nombreReportante,
      documentoReportante,
      parentesco,
      correoReportante,
      contactoReportante,
    });
  }

  return result;
}

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export const list: RequestHandler = async (req, res) => {
  const personas = await personaRepository.findAll({
    nombre: str(req.query.nombre),
    apellidoPaterno: str(req.query.apellidoPaterno),
    distrito: str(req.query.distrito),
    ciudad: str(req.query.ciudad),
    edad: str(req.query.edad),
    edadMin: str(req.query.edadMin),
    edadMax: str(req.query.edadMax),
    sexo: str(req.query.sexo),
    estado: str(req.query.estado),
  });

  return res.json(
    personas.map((persona) =>
      serializarPersona(persona, Boolean(req.user)),
    ),
  );
};

export const get: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(400).json({ message: "ID de persona inválido." });
  }

  const persona = await personaRepository.findById(id);

  if (!persona) {
    return res.status(404).json({ message: "Persona no encontrada." });
  }

  // El detalle público incluye los datos de contacto del reportante.
  return res.json(serializarPersona(persona, true));
};

export const create: RequestHandler = async (req, res) => {
  const persona = await personaRepository.create({
    ...req.body,
    publicadoPor: req.user!._id,
  });

  await historialCambioRepository.create({
    persona_id: persona._id,
    admin_id: req.user!._id,
    tipo_cambio: "CREACION",
    descripcion: "Registro de persona creado.",
    valor_nuevo: persona.toObject(),
  });

  return res.status(201).json(serializarPersona(persona.toObject(), true));
};

export const update: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(400).json({ message: "ID de persona inválido." });
  }

  const anterior = await personaRepository.findById(id);

  if (!anterior) {
    return res.status(404).json({ message: "Persona no encontrada." });
  }

  const persona = await personaRepository.update(id, req.body);

  if (!persona) {
    return res.status(404).json({ message: "Persona no encontrada." });
  }

  await historialCambioRepository.create({
    persona_id: persona._id,
    admin_id: req.user!._id,
    tipo_cambio: "MODIFICACION",
    descripcion: "Registro de persona actualizado.",
    valor_anterior: anterior,
    valor_nuevo: persona,
  });

  return res.json(serializarPersona(persona, true));
};

export const remove: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(400).json({ message: "ID de persona inválido." });
  }

  const persona = await personaRepository.remove(id);

  if (!persona) {
    return res.status(404).json({ message: "Persona no encontrada." });
  }

  await historialCambioRepository.create({
    persona_id: persona._id,
    admin_id: req.user!._id,
    tipo_cambio: "ELIMINACION",
    descripcion: "Registro de persona eliminado.",
    valor_anterior: persona,
  });

  return res.status(204).send();
};
