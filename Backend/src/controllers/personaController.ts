import type { RequestHandler } from "express";

import { historialCambioRepository } from "../repositories/HistorialCambioRepository.js";
import { personaRepository } from "../repositories/PersonaRepository.js";

export const list: RequestHandler = async (req, res) => {
  const personas = await personaRepository.findAll({
    nombre:
      typeof req.query.nombre === "string"
        ? req.query.nombre
        : undefined,

    departamento:
      typeof req.query.departamento === "string"
        ? req.query.departamento
        : undefined,

    edad:
      typeof req.query.edad === "string"
        ? req.query.edad
        : undefined,

    edadMin:
      typeof req.query.edadMin === "string"
        ? req.query.edadMin
        : undefined,

    edadMax:
      typeof req.query.edadMax === "string"
        ? req.query.edadMax
        : undefined,

    genero:
      typeof req.query.genero === "string"
        ? req.query.genero
        : undefined,

    estado:
      typeof req.query.estado === "string"
        ? req.query.estado
        : undefined,
  });

  const data = personas.map((persona) => {
    const { _id, ...rest } = persona;

    return {
      id: String(_id),
      ...rest,
    };
  });

  res.json(data);
};

export const get: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "ID de persona inválido.",
    });
  }

  const persona = await personaRepository.findById(id);

  if (!persona) {
    return res.status(404).json({
      message: "Persona no encontrada.",
    });
  }

  const { _id, ...rest } = persona;

  res.json({
    id: String(_id),
    ...rest,
  });
};

export const create: RequestHandler = async (req, res) => {
  const persona = await personaRepository.create({
    ...req.body,
    publicado_por: req.user!._id,
  });

  await historialCambioRepository.create({
    persona_id: persona._id,
    admin_id: req.user!._id,
    tipo_cambio: "CREACION",
    descripcion: "Registro de persona creado.",
    valor_nuevo: persona,
  });

  const { _id, ...rest } = persona;

  res.status(201).json({
    id: String(_id),
    ...rest,
  });
};

export const update: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "ID de persona inválido.",
    });
  }

  const anterior = await personaRepository.findById(id);

  if (!anterior) {
    return res.status(404).json({
      message: "Persona no encontrada.",
    });
  }

  const persona = await personaRepository.update(id, req.body);

  if (!persona) {
    return res.status(404).json({
      message: "Persona no encontrada.",
    });
  }

  await historialCambioRepository.create({
    persona_id: persona._id,
    admin_id: req.user!._id,
    tipo_cambio: "ACTUALIZACION",
    descripcion: "Registro de persona actualizado.",
    valor_anterior: anterior,
    valor_nuevo: persona,
  });

  const { _id, ...rest } = persona;

  res.json({
    id: String(_id),
    ...rest,
  });
};

export const remove: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "ID de persona inválido.",
    });
  }

  const persona = await personaRepository.remove(id);

  if (!persona) {
    return res.status(404).json({
      message: "Persona no encontrada.",
    });
  }

  await historialCambioRepository.create({
    persona_id: persona._id,
    admin_id: req.user!._id,
    tipo_cambio: "ELIMINACION",
    descripcion: "Registro de persona eliminado.",
    valor_anterior: persona,
  });

  res.status(204).send();
};