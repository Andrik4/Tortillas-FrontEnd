document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://www.tortillasaspnet.somee.com/api/produccion";
    const formAgregar = document.getElementById("form-agregar");
    const formEditar = document.getElementById("form-editar");
    const tablaProduccion = document.getElementById("tabla-produccion");

    // Obtener todas las producciones
    async function obtenerProduccion() {
        try {
            const response = await fetch(`${API_URL}/produccion`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            
            const result = await response.json();
            console.log("Datos recibidos:", result);
            
            if (result.data && Array.isArray(result.data)) {
                renderizarTabla(result.data);
            } else {
                console.error("La respuesta no contiene un array de producciones:", result);
            }
        } catch (error) {
            console.error("Error al obtener la producción:", error);
        }
    }

    // Renderizar la tabla con los datos
    function renderizarTabla(producciones) {
        tablaProduccion.innerHTML = "";
        producciones.forEach((prod) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${prod.fecha_produccion}</td>
                <td>${prod.turno}</td>
                <td>${prod.responsable}</td>
                <td>${prod.materia_prima_usada}</td>
                <td>${prod.cantidad_producida}</td>
                <td>${prod.merma}</td>
                <td>${prod.estado}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProduccion('${prod.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProduccion('${prod.id}')">Eliminar</button>
                </td>
            `;
            tablaProduccion.appendChild(fila);
        });
    }

    // Agregar una nueva producción
    formAgregar.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nuevaProduccion = {
            fecha_produccion: new Date(document.getElementById("fecha").value).toISOString(),
            turno: document.getElementById("turno").value,
            responsable: document.getElementById("responsable").value,
            materia_prima_usada: parseFloat(document.getElementById("materia").value),
            cantidad_producida: parseFloat(document.getElementById("cantidad").value),
            merma: parseFloat(document.getElementById("merma").value),
            estado: document.getElementById("estado").value,
        };
    
        try {
            const response = await fetch(`${API_URL}/registro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaProduccion),
            });
    
            if (response.ok) {
                obtenerProduccion();
                formAgregar.reset();
            } else {
                console.error("Error al agregar producción");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });

    // Eliminar una producción
    window.eliminarProduccion = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este registro?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

            if (response.ok) {
                obtenerProduccion();
            } else {
                console.error("Error al eliminar producción");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    window.editarProduccion = async (id) => {
        console.log("ID de la producción a editar:", id); // Verifica el ID
    
        try {
            const response = await fetch(`${API_URL}${id}`);

            if (!response.ok) {
                console.error("Error al obtener los datos de la producción");
                return; // Detiene la ejecución si hay error
            }
    
            const produccion = await response.json(); // ✅ Aquí sí esperamos JSON
    
            console.log("Datos de la producción:", produccion);
    
            // Llenar el formulario de edición con los datos obtenidos
            document.getElementById("edit-id").value = produccion.id;
            document.getElementById("edit-fecha").value = produccion.fecha_produccion.split("T")[0];
            document.getElementById("edit-turno").value = produccion.turno;
            document.getElementById("edit-responsable").value = produccion.responsable;
            document.getElementById("edit-materia").value = produccion.materia_prima_usada;
            document.getElementById("edit-cantidad").value = produccion.cantidad_producida;
            document.getElementById("edit-merma").value = produccion.merma;
            document.getElementById("edit-estado").value = produccion.estado;
    
            // Abrir el modal
            const modal = new bootstrap.Modal(document.getElementById("modal-editar"));
            modal.show();
        } catch (error) {
            console.error("Error al cargar los datos para editar:", error);
        }
    };
    
    // Actualizar una producción
    formEditar.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
    
        const produccionActualizada = {
            id: id,
            fecha_produccion: new Date(document.getElementById("edit-fecha").value).toISOString(),
            turno: document.getElementById("edit-turno").value,
            responsable: document.getElementById("edit-responsable").value,
            materia_prima_usada: parseFloat(document.getElementById("edit-materia").value),
            cantidad_producida: parseFloat(document.getElementById("edit-cantidad").value),
            merma: parseFloat(document.getElementById("edit-merma").value),
            estado: document.getElementById("edit-estado").value,
        };
    
        try {
            const response = await fetch(`${API_URL}${id}`
            , {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produccionActualizada),
            });
    
            if (response.ok) {
                console.log("Producción actualizada correctamente");
                obtenerProduccion(); // Refrescar la lista
                const modal = bootstrap.Modal.getInstance(document.getElementById("modal-editar"));
                modal.hide();
            } else {
                console.error("Error al actualizar la producción");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });
    
    // Cargar datos al iniciar
    obtenerProduccion();
});