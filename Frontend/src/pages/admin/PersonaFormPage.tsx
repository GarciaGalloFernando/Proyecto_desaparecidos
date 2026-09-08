import { useEffect, useState } from "react";
import type { FormEventHandler } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DEPARTAMENTOS } from "../../constants/ubicaciones";
import { personaAdminRepository } from "../../repositories/personaAdminRepository";
import type { PersonaFormData, Sexo } from "../../types/personaAdmin";

const FORM_INICIAL: PersonaFormData = {
  foto: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  sexo: "FEMENINO",
  fechaNacimiento: "",
  edad: 0,
  numeroDocumento: "",
  nacionalidad: "Boliviana",
  fechaDesaparicion: "",
  horaAproximada: "",
  departamento: "",
  ciudad: "",
  zona: "",
  direccion: "",
  circunstancias: "",
  ultimoLugarVisto: "",
};

function calcularEdad(fechaNacimiento: string): number {
  if (!fechaNacimiento) return 0;

  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) return 0;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

  if (aunNoCumple) edad -= 1;

  return Math.max(edad, 0);
}

function PersonaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const modoEdicion = Boolean(id);

  const [form, setForm] = useState<PersonaFormData>(FORM_INICIAL);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(modoEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelado = false;

    const cargarPersona = async () => {
      try {
        setCargando(true);
        setError("");

        const persona = await personaAdminRepository.obtener(id);
        if (cancelado) return;

        if (!persona) {
          setError("El registro que intenta editar no existe.");
          return;
        }

        setCodigo(persona.codigo);
        setForm({
          foto: persona.foto,
          nombres: persona.nombres,
          apellidoPaterno: persona.apellidoPaterno,
          apellidoMaterno: persona.apellidoMaterno,
          sexo: persona.sexo,
          fechaNacimiento: persona.fechaNacimiento,
          edad: persona.edad,
          numeroDocumento: persona.numeroDocumento,
          nacionalidad: persona.nacionalidad,
          fechaDesaparicion: persona.fechaDesaparicion,
          horaAproximada: persona.horaAproximada,
          departamento: persona.departamento,
          ciudad: persona.ciudad,
          zona: persona.zona,
          direccion: persona.direccion,
          circunstancias: persona.circunstancias,
          ultimoLugarVisto: persona.ultimoLugarVisto,
        });
      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error ? err.message : "No fue posible cargar el registro.",
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargarPersona();

    return () => {
      cancelado = true;
    };
  }, [id]);

  const setCampo = <K extends keyof PersonaFormData>(campo: K, valor: PersonaFormData[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleFechaNacimientoChange = (fecha: string) => {
    setForm((prev) => ({
      ...prev,
      fechaNacimiento: fecha,
      edad: calcularEdad(fecha),
    }));
  };

  const handleFotoChange = (archivo: File | null) => {
    if (!archivo) {
      setCampo("foto", "");
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setCampo("foto", typeof lector.result === "string" ? lector.result : "");
    };
    lector.readAsDataURL(archivo);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError("");

    const camposRequeridos: Array<[keyof PersonaFormData, string]> = [
      ["nombres", "Nombres"],
      ["apellidoPaterno", "Apellido paterno"],
      ["apellidoMaterno", "Apellido materno"],
      ["fechaNacimiento", "Fecha de nacimiento"],
      ["nacionalidad", "Nacionalidad"],
      ["fechaDesaparicion", "Fecha de desaparición"],
      ["departamento", "Departamento"],
      ["ciudad", "Ciudad / Municipio"],
      ["direccion", "Dirección o lugar exacto"],
    ];

    const faltante = camposRequeridos.find(([campo]) => !String(form[campo] ?? "").trim());
    if (faltante) {
      setError(`El campo "${faltante[1]}" es obligatorio.`);
      return;
    }

    try {
      setGuardando(true);

      if (modoEdicion && id) {
        await personaAdminRepository.actualizar(id, form);
      } else {
        await personaAdminRepository.crear(form);
      }

      navigate("/admin/personas", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible guardar el registro.",
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="state-message">
        <div className="loader"></div>
        <p>Cargando registro...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">
            {modoEdicion ? "EDITAR REGISTRO" : "NUEVO REGISTRO"}
          </span>
          <h1>
            {modoEdicion ? "Editar persona desaparecida" : "Añadir persona desaparecida"}
          </h1>
          <p>
            {modoEdicion
              ? `Actualiza los datos del registro ${codigo ?? ""}.`
              : "Completa los datos para registrar un nuevo caso."}
          </p>
        </div>
      </div>

      <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
        <section className="admin-form-section">
          <h2>Datos personales</h2>

          <div className="admin-form-photo">
            <div className="table-photo table-photo-large">
              {form.foto ? (
                <img src={form.foto} alt="Fotografía de la persona" />
              ) : (
                <span aria-hidden="true">Sin foto</span>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="foto">Fotografía</label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(event) => handleFotoChange(event.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="field-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                id="nombres"
                type="text"
                value={form.nombres}
                onChange={(event) => setCampo("nombres", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="apellidoPaterno">Apellido paterno</label>
              <input
                id="apellidoPaterno"
                type="text"
                value={form.apellidoPaterno}
                onChange={(event) => setCampo("apellidoPaterno", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="apellidoMaterno">Apellido materno</label>
              <input
                id="apellidoMaterno"
                type="text"
                value={form.apellidoMaterno}
                onChange={(event) => setCampo("apellidoMaterno", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="sexo">Sexo</label>
              <select
                id="sexo"
                value={form.sexo}
                onChange={(event) => setCampo("sexo", event.target.value as Sexo)}
              >
                <option value="FEMENINO">Femenino</option>
                <option value="MASCULINO">Masculino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input
                id="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(event) => handleFechaNacimientoChange(event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="edad">Edad</label>
              <input
                id="edad"
                type="number"
                min={0}
                max={130}
                value={form.edad}
                onChange={(event) => setCampo("edad", Number(event.target.value))}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="numeroDocumento">Número de documento (si se dispone)</label>
              <input
                id="numeroDocumento"
                type="text"
                value={form.numeroDocumento}
                onChange={(event) => setCampo("numeroDocumento", event.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <input
                id="nacionalidad"
                type="text"
                value={form.nacionalidad}
                onChange={(event) => setCampo("nacionalidad", event.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>Datos de la desaparición</h2>

          <div className="admin-form-grid">
            <div className="field-group">
              <label htmlFor="fechaDesaparicion">Fecha de desaparición</label>
              <input
                id="fechaDesaparicion"
                type="date"
                value={form.fechaDesaparicion}
                onChange={(event) => setCampo("fechaDesaparicion", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="horaAproximada">Hora aproximada</label>
              <input
                id="horaAproximada"
                type="time"
                value={form.horaAproximada}
                onChange={(event) => setCampo("horaAproximada", event.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="departamento">Departamento</label>
              <select
                id="departamento"
                value={form.departamento}
                onChange={(event) => setCampo("departamento", event.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {DEPARTAMENTOS.map((departamento) => (
                  <option key={departamento} value={departamento}>
                    {departamento}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="ciudad">Ciudad / Municipio</label>
              <input
                id="ciudad"
                type="text"
                value={form.ciudad}
                onChange={(event) => setCampo("ciudad", event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="zona">Zona</label>
              <input
                id="zona"
                type="text"
                value={form.zona}
                onChange={(event) => setCampo("zona", event.target.value)}
              />
            </div>

            <div className="field-group admin-form-span-2">
              <label htmlFor="direccion">Dirección o lugar exacto</label>
              <input
                id="direccion"
                type="text"
                value={form.direccion}
                onChange={(event) => setCampo("direccion", event.target.value)}
                required
              />
            </div>

            <div className="field-group admin-form-span-2">
              <label htmlFor="ultimoLugarVisto">Último lugar donde fue vista/o</label>
              <input
                id="ultimoLugarVisto"
                type="text"
                value={form.ultimoLugarVisto}
                onChange={(event) => setCampo("ultimoLugarVisto", event.target.value)}
              />
            </div>

            <div className="field-group admin-form-span-2">
              <label htmlFor="circunstancias">Circunstancias de la desaparición</label>
              <textarea
                id="circunstancias"
                rows={4}
                value={form.circunstancias}
                onChange={(event) => setCampo("circunstancias", event.target.value)}
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="form-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate("/admin/personas")}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button type="submit" className="btn btn-primary btn-large" disabled={guardando}>
            {guardando ? "Guardando..." : modoEdicion ? "Guardar cambios" : "Registrar persona"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonaFormPage;
