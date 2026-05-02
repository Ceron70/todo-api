const API_URL = 'http://localhost:8080/api/tasks';

// Obtener y mostrar todas las tareas
async function cargarTareas() {
    try {
        const response = await fetch(API_URL);
        const tareas = await response.json();
        const lista = document.getElementById('lista');
        lista.innerHTML = '';

        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.className = tarea.completed ? 'tarea-completada' : '';
            li.innerHTML = `
                <div>
                    <strong>${tarea.title}</strong><br>
                    <small>${tarea.description || 'Sin descripción'}</small><br>
                    <small>👤 Usuario ID: ${tarea.userId || 'N/A'}</small>
                </div>
                <div class="acciones">
                    <button class="btn-completar" data-id="${tarea.id}" data-completed="${tarea.completed}">
                        ${tarea.completed ? '✔ Completada' : '✓ Marcar'}
                    </button>
                    <button class="btn-eliminar" data-id="${tarea.id}">🗑 Eliminar</button>
                </div>
            `;
            lista.appendChild(li);
        });

        // Agregar eventos a los botones
        document.querySelectorAll('.btn-completar').forEach(btn => {
            btn.addEventListener('click', () => toggleCompletada(btn.dataset.id, btn.dataset.completed === 'true'));
        });
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => eliminarTarea(btn.dataset.id));
        });
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

// Crear una tarea nueva
document.getElementById('btnCrear').addEventListener('click', async () => {
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const userId = parseInt(document.getElementById('userId').value);

    if (!titulo) {
        alert('El título es obligatorio');
        return;
    }
    if (!userId) {
        alert('El ID de usuario es obligatorio');
        return;
    }

    const nuevaTarea = {
        title: titulo,
        description: descripcion,
        completed: false,
        userId: userId
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });
        if (response.ok) {
            document.getElementById('titulo').value = '';
            document.getElementById('descripcion').value = '';
            document.getElementById('userId').value = '';
            cargarTareas();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error al crear tarea:', error);
    }
});

// Marcar/desmarcar tarea como completada
async function toggleCompletada(id, completadaActual) {
    // Primero obtener la tarea actual para mantener los demás campos
    const responseGet = await fetch(`${API_URL}/${id}`);
    const tarea = await responseGet.json();

    tarea.completed = !completadaActual;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarea)
        });
        if (response.ok) {
            cargarTareas();
        }
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
    }
}

// Eliminar tarea
async function eliminarTarea(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            cargarTareas();
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
}

// Cargar tareas al iniciar
cargarTareas();