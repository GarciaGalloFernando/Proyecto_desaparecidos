declare global { namespace Express { interface User { _id: unknown; nombre:string; carnet:string; email:string; rol:"ADMIN"|"SUPER_ADMIN"; estado:"ACTIVO"|"INACTIVO"; } } } export {};
