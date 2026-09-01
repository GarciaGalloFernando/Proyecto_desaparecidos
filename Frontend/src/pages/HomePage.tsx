import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";

type Person = {
  name: string; age: number; gender: string; department: string; place: string; date: string; status: "DESAPARECIDO" | "ENCONTRADO" | "IDENTIFICADO"; image: string;
};

const people: Person[] = [
  { name: "María Fernanda Quispe", age: 24, gender: "Femenino", department: "La Paz", place: "Zona Miraflores", date: "12 Jun 2024", status: "DESAPARECIDO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=85" },
  { name: "Diego Alejandro Rojas", age: 17, gender: "Masculino", department: "Cochabamba", place: "Av. Blanco Galindo", date: "08 Jun 2024", status: "DESAPARECIDO", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85" },
  { name: "Sofía Camila Flores", age: 31, gender: "Femenino", department: "Santa Cruz", place: "Barrio Equipetrol", date: "27 May 2024", status: "ENCONTRADO", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85" },
];
const departments = ["Chuquisaca", "La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", "Tarija", "Beni", "Pando"];

function Mark({ size = 38 }: { size?: number }) {
  return <svg className="brand-mark" width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true"><circle cx="19" cy="16" r="5" fill="currentColor"/><path d="M10.5 31.5c1.6-6.3 15.4-6.3 17 0M27.5 28.5l5.8 5.8m-1.7-12.1a10 10 0 1 1-4.4-7.6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/><path d="M36 9.5c0 4.1-5 7.7-5 7.7s-5-3.6-5-7.7a5 5 0 1 1 10 0Z" fill="#45C5B2"/></svg>;
}
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>; }

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Person | null>(null);
  const user = authRepository.getCurrentUser();

  const results = useMemo(() => people.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase()) && (!department || person.department === department) && (!status || person.status === status)), [query, department, status]);
  const search = () => document.querySelector("#results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const reset = () => { setQuery(""); setDepartment(""); setStatus(""); };
  const admin = () => user ? navigate("/") : navigate("/login");

  return <div className="site-shell">
    <header className="topbar"><a className="brand" href="#inicio" aria-label="Personas Desaparecidas Bolivia, inicio"><Mark/><span>Personas Desaparecidas <b>Bolivia</b></span></a><nav><a href="#inicio">Inicio</a><a href="#buscar">Buscar personas</a><a href="#resultados">Personas encontradas</a><a href="#informacion">Información</a><a href="#contacto">Contacto</a></nav><button className="admin-button" onClick={admin}>Acceso administrativo <span>↗</span></button></header>

    <main>
      <section className="hero" id="inicio"><div className="hero-copy"><p className="eyebrow"><i/> Plataforma nacional de consulta</p><h1>Ayúdanos a encontrar.<br/><em>Cada búsqueda importa.</em></h1><p className="hero-text">Consulta información de personas desaparecidas y encontradas en Bolivia desde una plataforma centralizada, rápida y fácil de utilizar.</p><div className="hero-search"><SearchIcon/><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="¿A quién estás buscando?" aria-label="Buscar persona"/><button onClick={search}>Buscar <span>→</span></button></div><div className="quick-links"><span>Accesos rápidos:</span><button onClick={() => { setStatus("DESAPARECIDO"); search(); }}>Personas desaparecidas</button><button onClick={() => { setStatus("ENCONTRADO"); search(); }}>Personas encontradas</button><button onClick={() => document.querySelector("#buscar")?.scrollIntoView({ behavior: "smooth" })}>Buscar por departamento</button></div></div><div className="hero-art" aria-hidden="true"><div className="map-shape"/><div className="map-label label-one"><span>⌖</span> La Paz</div><div className="map-label label-two"><span>⌖</span> Cochabamba</div><div className="map-label label-three"><span>⌖</span> Santa Cruz</div><div className="connection c1"/><div className="connection c2"/><div className="hero-orbit"/><div className="hero-person"><Mark size={96}/></div></div></section>

      <section className="filter-section" id="buscar"><div className="section-heading"><p className="eyebrow">Consulta de registros</p><h2>Encuentra información <em>rápidamente</em></h2><p>Utiliza los filtros para realizar una búsqueda más precisa.</p></div><div className="filters"><label className="field search-field"><span>Nombre de la persona</span><div><SearchIcon/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre de la persona..."/></div></label><label className="field"><span>Departamento</span><select value={department} onChange={(e) => setDepartment(e.target.value)}><option value="">Todos los departamentos</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field"><span>Edad</span><select><option>Todas las edades</option><option>0 - 17 años</option><option>18 - 35 años</option><option>36+ años</option></select></label><label className="field"><span>Género</span><select><option>Todos los géneros</option><option>Femenino</option><option>Masculino</option></select></label><label className="field"><span>Estado</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option><option>DESAPARECIDO</option><option>ENCONTRADO</option><option>IDENTIFICADO</option><option>CASO CERRADO</option></select></label><label className="field"><span>Fecha de desaparición</span><input type="date"/></label><div className="filter-actions"><button className="primary-button" onClick={search}>Buscar personas <span>→</span></button><button className="clear-button" onClick={reset}>Limpiar filtros</button></div></div></section>

      <section className="results-section" id="results"><div className="results-head"><div><p className="eyebrow">Registros recientes</p><h2>Personas que estamos <em>buscando</em></h2></div><button className="text-button" onClick={reset}>Ver todos los registros <span>→</span></button></div><div className="people-grid" id="resultados">{results.length ? results.map((person) => <article className="person-card" key={person.name}><div className="person-photo"><img src={person.image} alt={person.name}/><span className={`status ${person.status.toLowerCase()}`}>{person.status}</span></div><div className="person-content"><h3>{person.name}</h3><p className="person-info">{person.age} años <i/> {person.gender}</p><div className="case-meta"><p><b>⌖</b>{person.department}</p><p><b>◷</b>{person.place}</p><p><b>□</b>Desaparición: {person.date}</p></div><button onClick={() => setSelected(person)}>Ver información <span>→</span></button></div></article>) : <div className="empty-state">No encontramos resultados con esos filtros. Intenta ampliar tu búsqueda.</div>}</div></section>

      <section className="stats"><div className="stat-intro"><p className="eyebrow"><i/> Datos que importan</p><h2>La información organizada<br/>puede <em>ayudar a encontrar.</em></h2><p>Trabajamos para que cada registro sea más accesible, claro y útil para las familias.</p></div><div className="stat-grid"><div><span>⌕</span><strong>1,248</strong><p>Personas desaparecidas</p></div><div><span>♡</span><strong>836</strong><p>Personas encontradas</p></div><div><span>✓</span><strong>312</strong><p>Personas identificadas</p></div><div><span>▤</span><strong>2,396</strong><p>Casos registrados</p></div></div></section>

      <section className="departments"><div className="section-heading"><p className="eyebrow">Cobertura nacional</p><h2>Busca por <em>departamento</em></h2><p>Encuentra información relevante según el lugar de registro.</p></div><div className="department-grid">{departments.map((item, index) => <button key={item} onClick={() => { setDepartment(item); document.querySelector("#buscar")?.scrollIntoView({ behavior: "smooth" }); }}><span>0{index + 1}</span>{item}<b>→</b></button>)}</div></section>

      <section className="hope" id="informacion"><div className="hope-icon"><Mark size={74}/></div><div><p className="eyebrow"><i/> Una red que acompaña</p><h2>Una persona desaparecida<br/>no es solo un <em>registro.</em></h2><p>Centralizar la información permite facilitar la consulta, mejorar la organización de los registros y contribuir a que más personas puedan encontrar información relevante.</p></div><button onClick={() => document.querySelector("#buscar")?.scrollIntoView({ behavior: "smooth" })}>Realizar una búsqueda <span>→</span></button></section>
    </main>
    <footer id="contacto"><a className="brand" href="#inicio"><Mark/><span>Personas Desaparecidas <b>Bolivia</b></span></a><p>Una plataforma para facilitar la búsqueda de información.</p><small>© 2024 PDB · Información de acceso público y autorizado.</small></footer>
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(e) => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button><img src={selected.image} alt={selected.name}/><div><span className={`status ${selected.status.toLowerCase()}`}>{selected.status}</span><p className="eyebrow">Información del caso</p><h2 id="detail-title">{selected.name}</h2><p className="person-info">{selected.age} años <i/> {selected.gender}</p><dl><dt>Departamento</dt><dd>{selected.department}</dd><dt>Lugar de desaparición</dt><dd>{selected.place}</dd><dt>Fecha de desaparición</dt><dd>{selected.date}</dd></dl><p className="detail-note">Si cuenta con información relevante, comuníquese únicamente a través de los canales autorizados.</p></div></section></div>}
  </div>;
}

export default HomePage;
