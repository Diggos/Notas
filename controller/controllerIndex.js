const notas = require('../model/notaMongo.js')

// cria e já exporta a função que será responsável pela tela principal
exports.tela_principal = async function (req, res) {
    var contagem = await notas.qtd()
    var condicao;
    var lida, nao_lida, i1, i2, i3, i4, i5
    if(contagem == 0)
        condicao = true;
// ----- //
    var condicao_pesquisa = false, pesquisa="todos"; 
    var nota = await notas.lista(pesquisa)

    if(req.body.bt_pesquisar != undefined){
        condicao_pesquisa = true;
        pesquisa = req.body.query
        nota = await notas.lista(pesquisa)
    }
    else if(req.body.bt_cancelar != undefined){
        pesquisa = "todos"
        condicao_pesquisa = false;
        nota = await notas.lista(pesquisa)
    }else if(req.body.bt_pesquisar == undefined){
        
        nota = await notas.lista(pesquisa)
    }

    
    else if(req.body.bt_filtro != undefined){
        var filtroImportancia = [];
        var filtroLida = [];
        // Verifica os filtros de importância
        if (req.body.imp_1){
            filtroImportancia.push(1);
            i1 = true
        }
        if (req.body.imp_2){
             filtroImportancia.push(2);
             i2 = true;}
        if (req.body.imp_3){
            filtroImportancia.push(3);
            i3 = true;}
        if (req.body.imp_4){
            filtroImportancia.push(4);
            i4 = true;}
        if (req.body.imp_5){
            filtroImportancia.push(5);
            i5 = true;}

        // Verifica os filtros de estado de leitura
        if (req.body.estado_lida){
            filtroLida.push(true);
            lida = true;}
        if (req.body.estado_n_lida){
            filtroLida.push(false);
            nao_lida = true
        } 

        pesquisa = {
            filtroImportancia: filtroImportancia,
            filtroLida: filtroLida
        }
        console.log("Controller:" )
        console.log(pesquisa)
        if((pesquisa.filtroImportancia.length == 0)){
            nota = await notas.lista("todos")
        }
        else
            nota = await notas.lista_filtrada(pesquisa)
    }     

    contexto = {
        titulo_pagina: "Gerenciador de Notas de Texto",
        notas: nota,
        condicao: condicao,
        condicao_pesquisa: condicao_pesquisa,
        pesquisa: pesquisa,
        lida:lida,
        nao_lida: nao_lida,
        i1:i1,
        i2:i2,
        i3:i3,
        i4:i4,
        i5:i5,
    }

// renderiza o arquivo index.hbs, dentro da pasta view
res.render('index', contexto);
}

exports.sobre = async function(req, res){
    contexto = {
    titulo_pagina: "Sobre o Aplicativo",
    }
    // renderiza o arquivo na dentro da pasta view
    res.render('sobre', contexto);
    }