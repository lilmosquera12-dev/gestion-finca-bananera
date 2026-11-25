const API_URL = window.location.origin;

async function cargarRoles() {
    const selectRol = document.getElementById('rolSelect');
    const statRoles = document.getElementById('statRoles');

    try {
        const respuesta = await fetch(`${API_URL}/roles`);
        const roles = await respuesta.json();

        if (!Array.isArray(roles)) {
            throw new Error('La respuesta de /roles no es una lista');
        }

        if (statRoles) {
            statRoles.textContent = roles.length;
        }

        if (selectRol) {
            selectRol.innerHTML = '<option value="">Selecciona el Rol...</option>';
            roles.forEach((rol) => {
                const opcion = document.createElement('option');
                opcion.value = rol.id_rol;
                opcion.textContent = rol.nombre_rol;
                selectRol.appendChild(opcion);
            });
        }
    } catch (error) {
        console.error('Error al cargar roles:', error);
        if (statRoles) {
            statRoles.textContent = '0';
        }
    }
}

async function manejarLogin(event) {
    event.preventDefault();

    const docInput = document.getElementById('docLogin');
    const resultadoDiv = document.getElementById('resultadoLogin');
    const documento = docInput ? docInput.value.trim() : '';

    if (!documento) {
        if (resultadoDiv) resultadoDiv.textContent = 'Escribe el número de documento a consultar.';
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documento })
        });

        const resultado = await respuesta.json();

        if (resultado.success) {
            if (resultadoDiv) {
                resultadoDiv.innerHTML = `Trabajador registrado: <strong>${resultado.nombre}</strong> — Rol/Cargo: <strong>${resultado.rol}</strong>`;
            }
        } else if (resultadoDiv) {
            resultadoDiv.textContent = resultado.message || 'El documento no se encuentra registrado.';
        }
    } catch (error) {
        console.error('Error en consulta:', error);
        if (resultadoDiv) {
            resultadoDiv.textContent = 'Error: El servidor no responde.';
        }
    }
}

async function manejarCrearRol(event) {
    event.preventDefault();

    const rolInput = document.getElementById('nombreRol');
    const resultadoRol = document.getElementById('resultadoRol');
    const nombre_rol = rolInput ? rolInput.value.trim() : '';

    if (!nombre_rol) {
        if (resultadoRol) resultadoRol.textContent = 'Escribe el nombre del rol.';
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/nuevo-rol`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_rol })
        });

        const res = await respuesta.json();

        if (resultadoRol) {
            resultadoRol.textContent = res.message || (res.success ? 'Rol creado.' : 'No se pudo crear el rol.');
        }

        if (res.success) {
            rolInput.value = '';
            await cargarRoles();
        }
    } catch (error) {
        console.error('Error al crear rol:', error);
        if (resultadoRol) {
            resultadoRol.textContent = 'Error al conectar con el servidor.';
        }
    }
}

async function manejarRegistroTrabajador(event) {
    event.preventDefault();

    const mensajeP = document.getElementById('mensaje');
    const datos = {
        documento: document.getElementById('documento')?.value.trim() || '',
        telefono: document.getElementById('telefono')?.value.trim() || '',
        nombre: document.getElementById('nombres')?.value.trim() || '',
        apellido: document.getElementById('apellidos')?.value.trim() || '',
        fk_rol: document.getElementById('rolSelect')?.value || '',
        fecha: document.getElementById('fecha')?.value || ''
    };

    if (!datos.fk_rol) {
        if (mensajeP) mensajeP.textContent = 'Debes seleccionar un rol de la lista.';
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/nuevo-trabajador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const res = await respuesta.json();

        if (mensajeP) {
            mensajeP.textContent = res.message || (res.success ? 'Trabajador registrado.' : 'Error al registrar.');
        }

        if (res.success) {
            document.getElementById('trabajadorForm')?.reset();
        }
    } catch (error) {
        console.error('Error al registrar trabajador:', error);
        if (mensajeP) {
            mensajeP.textContent = 'Error al registrar trabajador.';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();

    document.getElementById('loginForm')?.addEventListener('submit', manejarLogin);
    document.getElementById('rolForm')?.addEventListener('submit', manejarCrearRol);
    document.getElementById('trabajadorForm')?.addEventListener('submit', manejarRegistroTrabajador);
});