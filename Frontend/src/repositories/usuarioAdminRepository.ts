import { authRepository } from "./authRepository";
import type { EstadoUsuario, UsuarioAdmin, UsuarioFormData } from "../types/usuarioAdmin";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(url:string, options:RequestInit={}):Promise<T>{
  const response=await fetch(url,{...options,headers:{"Content-Type":"application/json",...authRepository.getAuthorizationHeader(),...(options.headers??{})}});
  const data=response.status===204?undefined:await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data?.message??"No fue posible completar la operación.");
  return data as T;
}

export const usuarioAdminRepository={
  listar:()=>request<UsuarioAdmin[]>(`${API_URL}/admins`),
  obtener:async(id:string)=>{
    try{return await request<UsuarioAdmin>(`${API_URL}/admins/${id}`);}
    catch(e){if(e instanceof Error&&e.message==="Usuario no encontrado.")return null;throw e;}
  },
  crear:(datos:UsuarioFormData)=>request<UsuarioAdmin>(`${API_URL}/admins`,{method:"POST",body:JSON.stringify(datos)}),
  actualizar:(id:string,datos:UsuarioFormData)=>request<UsuarioAdmin>(`${API_URL}/admins/${id}`,{method:"PATCH",body:JSON.stringify(datos)}),
  cambiarEstado:(id:string,estado:EstadoUsuario)=>request<UsuarioAdmin>(`${API_URL}/admins/${id}/estado`,{method:"PATCH",body:JSON.stringify({estado})}),
};
