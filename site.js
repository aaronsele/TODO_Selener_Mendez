const inpuTarea = document.getElementById("inpuTarea");
const botonAñadirTarea = document.getElementById("botonAñadirTarea");
const listaTareas = document.getElementById("listaTareas");
const borrarCompletados = document.getElementById("borrarCompletados");


let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


const guardarTareas = () => localStorage.setItem("tareas", JSON.stringify(tareas));


const probTareas = () => {
    listaTareas.innerHTML = "";
    tareas.forEach(({ texto, completada, fecha, fechaCompletada }, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="${completada ? "completada" : ""}">${texto} (Creado: ${new Date(fecha).toLocaleString()})</span>
            <button onclick="cambiosTarea(${index})">${completada ? "Desmarcar" : "Completar"}</button>
            <button onclick="borrarTarea(${index})">Eliminar</button>
        `;
        listaTareas.appendChild(li);
    });
};


botonAñadirTarea.addEventListener("click", () => {
    const texto = inpuTarea.value.trim();
    if (texto) {
        tareas.push({ texto, completada: false, fecha: Date.now(), fechaCompletada: null });
        guardarTareas();
        probTareas();
        inpuTarea.value = "";
    }
});

const borrarTarea = (index) => {
    tareas.splice(index, 1);
    guardarTareas();
    probTareas();
};


const cambiosTarea = (index) => {
    tareas[index].completada = !tareas[index].completada;
    tareas[index].fechaCompletada = tareas[index].completada ? Date.now() : null;
    guardarTareas();
    probTareas();
};



borrarCompletados.addEventListener("click", () => {
    tareas = tareas.filter(tarea => !tarea.completada);
    guardarTareas();
    probTareas();
});


const velocidadTarea = () => {
    const tareasCompletadas = tareas.filter(tarea => tarea.completada && tarea.fechaCompletada);
    if (!tareasCompletadas.length) return "No hay tareas completadas";
    const masRapida = tareasCompletadas.reduce((anterior, ahora) => 
        (ahora.fechaCompletada - ahora.fecha) < (anterior.fechaCompletada - anterior.fecha) ? ahora : anterior);
    return `Tarea más rápida: ${masRapida.texto} en ${(masRapida.fechaCompletada - masRapida.fecha) / 1000} segundos`;
};

document.getElementById("botonTareaRapida").addEventListener("click", () => {
    document.getElementById("tareaMasRapida").textContent = velocidadTarea();
});


probTareas();
