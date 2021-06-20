var exam;
const colorInputBase = "rgb(234, 234, 234)";
function getValue(nameField){
    return document.getElementById(nameField).value;
}

class palabra{
    constructor(arrParam){
        this.espVerbo = arrParam[0];
        this.ingInfinitivo = arrParam[1];
        this.ingGerundio = arrParam[2];
        this.ingParticipio = arrParam[3];
    }
}

class examen{
    constructor(n_preguntas, tipo_aprendizaje, bAyuda, nGroup){
        this.n_preguntas = n_preguntas;
        this.tipo_aprendizaje = tipo_aprendizaje;
        this.bAyuda = bAyuda;
        this.nGroup = nGroup;
        this.arrayPalabras = [];
        this.arrayAleatorio = [];

        loadVerb(this.arrayPalabras);
        
        this.nTotalGrupo = Math.ceil(this.arrayPalabras.length / this.n_preguntas);
        if (nGroup > this.nTotalGrupo){
            this.nGroup = this.nTotalGrupo;
        }
    }

    getQuizRandom(){
        this.arrayAleatorio = [];
        var nElementosAleatorios = this.arrayPalabras.length;
        if (this.nGroup >= 1){
            nElementosAleatorios = this.n_preguntas;
        }

        do {
           
            var valorAleatorio = Math.floor(Math.random() * nElementosAleatorios);
            if (this.nGroup >= 1){
                valorAleatorio += (this.nGroup -1) * this.n_preguntas;
                if (valorAleatorio >= this.arrayPalabras.length){
                    valorAleatorio = ((this.nGroup -1) * this.n_preguntas) - (valorAleatorio - this.arrayPalabras.length + 1);
                }
            }
            if(this.arrayAleatorio.find(element=>element==valorAleatorio)===undefined){;
                this.arrayAleatorio.push(valorAleatorio);
            }
        } while (this.arrayAleatorio.length < this.n_preguntas);
    }
  
    getidShowWord(){
        switch (this.tipo_aprendizaje){
            case "0": return 0;
            case "1": return 123;
            case "2": return Math.floor(Math.random() * 4);   
        }
    }
    filtrarPalabra(palabra){
        var salida = '';
        var pos1 = Math.floor(Math.random() * palabra.length);
        var pos2 = Math.floor(Math.random() * palabra.length);
        for (var k=0; k<palabra.length; k++){
            if (k == pos1){
                salida += palabra[k];
            } else { 
                if (k==pos2){
                    salida += palabra[k]
                }else{
                    salida += "_";
                }
            }
        }
        return salida;
    }
    showWord(line, idWord, pos, idShow){
        var text = '';
        var wordShow = '';
        var readonly = '';
        var word = this.arrayPalabras[idWord];
        if (this.bAyuda ==1) {
            wordShow = this.filtrarPalabra(word[pos]);
        }
        if ((idShow == "123" && ((pos ==1) || (pos==2) || (pos==3))) || (idShow == pos)){
            wordShow = word[pos]
            readonly = 'style="background-color:' + colorInputBase + ';"';
        } 
        text += '<input type="text" class="textForm" id="' + line + '_' + pos + '" value="' + wordShow + '" '+ readonly +'/>';
        return text;
    }

    getRepetidos(idWord){
        var text='';
        var cant = '';
        var wd = new palabra(this.arrayPalabras[idWord]);
        if (this.bAyuda == "2"){
            cant = "0";
            if (wd.ingGerundio == wd.ingInfinitivo && wd.ingGerundio == wd.ingParticipio){ cant="3";} 
            else{ if(wd.ingGerundio == wd.ingInfinitivo || wd.ingGerundio == wd.ingParticipio || wd.ingInfinitivo == wd.ingParticipio){ cant="2" }}
            text = '<div id="textAyuda">(' + cant + ')</div>';
        }
        return text;
    }

    seeWords(){
        for (var k=0; k < this.arrayAleatorio.length; k++){
            var idWord = this.arrayAleatorio[k];
            var palabra = this.arrayPalabras[idWord];
            document.getElementById(k + '_0').value = palabra[0];
            document.getElementById(k + '_1').value = palabra[1];
            document.getElementById(k + '_2').value = palabra[2];
            document.getElementById(k + '_3').value = palabra[3];
        }
    }

    showExam(){
        var out = '';
        
        this.getQuizRandom();

        for (var k=0; k < this.arrayAleatorio.length; k++){
            var idWord = this.arrayAleatorio[k];
            var idShow = this.getidShowWord()
            out += '<span>';
            out += '<input type="hidden" id="idWord_' + k + '" value="' + idWord + '" />';
            out += this.showWord(k, idWord, 0, idShow);
            out += this.showWord(k, idWord, 1, idShow);
            out += this.showWord(k, idWord, 2, idShow);
            out += this.showWord(k, idWord, 3, idShow);
            out += this.getRepetidos(idWord);
            out += '<button onclick="mostrarSolucion(' + idWord + ')">?</button>';
            out += '<br/>';
            out += '</span>';
        }
        return out;
        

    }

    resultAsk(){
        var arrCont = [0,0];

        for(var k = 0; k < this.arrayAleatorio.length; k++){
            var idWord = getValue('idWord_' + k);
            var palabra = this.arrayPalabras[idWord];
            for (var j = 0; j < 4; j++) {
                var valEscrito = getValue(k + '_' + j);
                var colorFondo = document.getElementById(k+'_'+j).style.backgroundColor;
                var isReadonly = ( colorFondo == colorInputBase);
                if (!isReadonly){
                    if (valEscrito == palabra[j]){
                        arrCont[0]++;
                        document.getElementById(k+'_'+j).style.backgroundColor = "#5FB9E0";
                    } else {
                        arrCont[1]++;
                        document.getElementById(k+'_'+j).style.backgroundColor = "rgb(252, 105, 105)"; //"red";
                    }
                }
            }

        }
        return arrCont;
    }
}

// Add crea cabecera
function addHeaderTable(idDiv){
    text = '<span>';
    text += '<div id="cabecera">Espa&ntilde;ol</div>';
    text += '<div id="cabecera">Infinitivo</div>';
    text += '<div id="cabecera">Pasado</div>';
    text += '<div id="cabecera">Participio</div>';
    text += '<br/>'
    text += '</span>';
    document.getElementById(idDiv).innerHTML += text  
}


// Muestra las preguntas y los campos
function mostrarExamen(){
    //Recoge la información del formulario
    var nQuestions = getValue('n_questions');
    var typeQuestions = getValue('type_question'); //0 Español-Ingles, 1 Inglés español, 2 aleatorio
    var bAyuda = getValue('with_help'); 
    var nGroup = getValue('numberGroup'); 

    // En caso de seleccionar todas las respuestas
    if (nQuestions == 0) {
        nQuestions = arrayVerb.length;
    }

    document.getElementById("resultadoFinal").innerHTML='';
    document.getElementById("palabrasCorrectas").innerHTML='';
    document.getElementById("examList").innerHTML='';

    exam = new examen(nQuestions, typeQuestions, bAyuda, nGroup);

    addHeaderTable("examList");
    document.getElementById("lblMaxGrupos").innerHTML = "Max. " + exam.nTotalGrupo;
    document.getElementById("examList").innerHTML += exam.showExam();
    document.getElementById("btnResult").disabled = false;
    
} 

function genResult(){
    var result = exam.resultAsk();
    document.getElementById("resultadoFinal").innerHTML= "<h2>" + (result[0]*100/(result[0]+result[1])) + "% aciertos (Bien:" + result[0]+ ', Mal:' + result[1] + ")</h2>";
}
function mostrarSolucion(id){

    if (document.getElementById("resultadoFinal").innerHTML!=''){
        var verbo = new palabra(exam.arrayPalabras[id]);
        var texto = '';
        texto  = '(' + verbo.espVerbo + ') - ';
        texto += '(' + verbo.ingInfinitivo + ') - ';
        texto += '(' + verbo.ingGerundio + ') - ';
        texto += '(' + verbo.ingParticipio  + ')';
        document.getElementById("palabrasCorrectas").innerHTML = texto;
    }
}
function verResultados(){
    exam.seeWords();
    document.getElementById("btnResult").disabled = true;

}
function changePropertyForGroup(){
    document.getElementById("numberGroup").disabled = !document.getElementById("forgroup").checked;
    if (document.getElementById("numberGroup").disabled){
        document.getElementById("numberGroup").value = '';
    } else {
        document.getElementById("numberGroup").value = '1';
    }

    
}