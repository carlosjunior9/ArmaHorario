let materias = JSON.parse(localStorage.getItem("materias")) || [];

const diasSemana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

function renderHorario(){

const cont = document.getElementById("horario");
cont.innerHTML="";

diasSemana.forEach(dia=>{

let columna=document.createElement("div");
columna.className="dia";

let titulo=document.createElement("h3");
titulo.innerText=dia;

columna.appendChild(titulo);

let clases=[];

materias.forEach(m=>{
m.horarios.forEach(h=>{
if(h.dia===dia){
clases.push({...h,materia:m.materia,grupo:m.grupo,color:m.color});
}
})
})

clases.sort((a,b)=>a.inicio.localeCompare(b.inicio));

clases.forEach(c=>{

let b=document.createElement("div");
b.className="bloque";
b.style.background=c.color;

b.innerHTML=
`${c.materia}<br>
Grupo ${c.grupo}<br>
${c.aula? "Aula "+c.aula+"<br>":""}
${c.inicio} a ${c.fin}`;

columna.appendChild(b);

})

cont.appendChild(columna);

})

}

function abrirFormulario(){
document.getElementById("formulario").style.display="flex";
document.getElementById("diasContainer").innerHTML="";
agregarDia();
}

function cerrarFormulario(){
document.getElementById("formulario").style.display="none";
}

function agregarDia(){

let cont=document.getElementById("diasContainer");

let div=document.createElement("div");
div.className="diaItem";

div.innerHTML=`

<label>Día</label>
<select class="dia">
${diasSemana.map(d=>`<option>${d}</option>`).join("")}
</select>

<label>Hora inicio</label>
<input type="time" class="inicio">

<label>Hora fin</label>
<input type="time" class="fin">

<label>Aula</label>
<input class="aula">

<button onclick="this.parentElement.remove()">Eliminar día</button>

`;

cont.appendChild(div);

}

function guardarMateria(){

let materia=document.getElementById("materia").value;
let grupo=document.getElementById("grupo").value;
let color=document.getElementById("color").value;

let horarios=[];

document.querySelectorAll(".diaItem").forEach(d=>{

horarios.push({
dia:d.querySelector(".dia").value,
inicio:d.querySelector(".inicio").value,
fin:d.querySelector(".fin").value,
aula:d.querySelector(".aula").value
});

});

materias.push({
materia,
grupo,
color,
horarios
});

localStorage.setItem("materias",JSON.stringify(materias));

cerrarFormulario();
renderHorario();
}

function abrirEditor(){

let sel=document.getElementById("listaMaterias");
sel.innerHTML="";

materias.forEach((m,i)=>{

let dias=m.horarios.map(h=>`${h.dia} ${h.inicio}`).join(", ");

let op=document.createElement("option");
op.value=i;
op.text=`${m.materia} - Grupo ${m.grupo} (${dias})`;

sel.appendChild(op);

})

document.getElementById("editor").style.display="flex";
}

function cerrarEditor(){
document.getElementById("editor").style.display="none";
}

function eliminarMateria(){

let i=document.getElementById("listaMaterias").value;

materias.splice(i,1);

localStorage.setItem("materias",JSON.stringify(materias));

cerrarEditor();
renderHorario();
}

function editarMateria(){

let i=document.getElementById("listaMaterias").value;

let m=materias[i];

document.getElementById("materia").value=m.materia;
document.getElementById("grupo").value=m.grupo;
document.getElementById("color").value=m.color;

let cont=document.getElementById("diasContainer");
cont.innerHTML="";

m.horarios.forEach(h=>{

agregarDia();

let d=cont.lastChild;

d.querySelector(".dia").value=h.dia;
d.querySelector(".inicio").value=h.inicio;
d.querySelector(".fin").value=h.fin;
d.querySelector(".aula").value=h.aula;

})

materias.splice(i,1);

cerrarEditor();
abrirFormulario();

}

function descargarHorario(){

let contenido = document.getElementById("horario").innerText;

let blob = new Blob([contenido], {type: "text/plain"});
let a = document.createElement("a");

a.href = URL.createObjectURL(blob);
a.download = "horario.txt";
a.click();

}

function renderHorario(){

const cont = document.getElementById("horario");
cont.innerHTML="";

let todosHorarios=[];

materias.forEach(m=>{
m.horarios.forEach(h=>{
todosHorarios.push(h.inicio);
})
});

let horas=[...new Set(todosHorarios)].sort();

diasSemana.forEach(dia=>{

let columna=document.createElement("div");
columna.className="dia";

let titulo=document.createElement("h3");
titulo.innerText=dia;

columna.appendChild(titulo);

horas.forEach(hora=>{

let clases=[];

materias.forEach(m=>{
m.horarios.forEach(h=>{
if(h.dia===dia && h.inicio===hora){
clases.push({...h,materia:m.materia,grupo:m.grupo,color:m.color});
}
})
})

if(clases.length===0){

let espacio=document.createElement("div");
espacio.style.height="40px";
columna.appendChild(espacio);

}else{

clases.forEach(c=>{

let b=document.createElement("div");
b.className="bloque";
b.style.background=c.color;

b.innerHTML=
`${c.materia}<br>
Grupo ${c.grupo}<br>
${c.aula? "Aula "+c.aula+"<br>":""}
${c.inicio} a ${c.fin}`;

columna.appendChild(b);

});

}

});

cont.appendChild(columna);

});

}