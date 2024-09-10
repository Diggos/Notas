// importação da classe que gerencia as notas na memória
const notas = require('../model/notaMongo.js')
// cria e já exporta a função que será responsável pela criação de nota
exports.cria_get = async function (req, res) {
    contexto = {
        titulo_pagina: "Criação de Nota",
    }
    // renderiza o arquivo dentro da pasta view
    res.render('criaNota', contexto);
}

exports.cria_post = async function(req, res){
    // obtém as informações do formulário
    var nota = req.body
    nota.importancia = parseInt(nota.importancia)
    // cria a nota nota
    await notas.cria(nota)
    // redireciona para a página principal
    res.redirect('/')
    }

//função que cria 4 notas de teste
exports.teste_cria = async function (req, res) {
    for (var i = 1; i <= 4; i++) {
      var nota = {
        chave: i.toString(), 
        titulo: "Nota de Teste " + i,
        texto: "Lorem Ipsilium",
        importancia: 1,
        lida: false 
      };
      await notas.cria(nota);
    }
    res.redirect("/");
  };

// cria e já exporta a função que será responsável pela consulta a nota
exports.consulta = async function(req, res){
    //informação passada como parâmetro na url
    var chave = req.params.chave_nota
    var nota = await notas.consulta(chave)
    nota.lida = true
    //atualização no banco de dados
    await notas.atualiza(nota)
    contexto = {
    titulo_pagina: "Consulta a Nota",
    nota: nota, //não preciso mais passar cada campo
    }
    // renderiza o arquivo dentro da pasta view
    res.render('consultaNota', contexto)
    }

// cria e já exporta a função que será responsável pela alteração de nota
exports.altera_get = async function(req, res){
    //informação passada como parâmetro na url
    var chave = req.params.chave_nota
    var nota = await notas.consulta(chave)
    contexto = {
    titulo_pagina: "Altera a Nota",
    nota: nota,
    }
    // renderiza o arquivo dentro da pasta view
    res.render('alteraNota', contexto)
    }

// cria e já exporta a função que será responsável pela criação de nota
exports.altera_post = async function(req, res){
    // obtem as informações do formulário
    var nota = req.body
    if(req.body.status === 'on'){
    nota.lida = true
    nota.importancia = parseInt(nota.importancia)
    delete nota.status //deleta este atributo para ele não ser armazenado em BD
    }
    else
    nota.lida = false
    // atualiza a nota com a chave e o status também
    await notas.atualiza(nota)
    // redireciona para a página principal
    res.redirect('/')
    }

exports.deleta = async function (req, res) {
    //informação passada como parâmetro na url
    var chave = req.params.chave_nota
    await notas.deleta(chave);
    // redireciona para a página principal
    res.redirect('/');
}
//cria e já exporta a função que será responsável pela alteração do status da nota para lida
exports.lida = async function (req, res) {
    var chave = req.params.chave_nota
    var nota = await notas.consulta(chave)
    nota.lida = true
    //atualização no banco de dados
    await notas.atualiza(nota)
    console.log("acessou nota lida: "+chave)
    // redireciona para a página principal
    res.redirect('/')
}
//cria e já exporta a função que será responsável pela alteração do status da nota para não lida
exports.naolida = async function (req, res) {
    var chave = req.params.chave_nota
    var nota = await notas.consulta(chave)
    nota.lida = false
    //atualização no banco de dados
    await notas.atualiza(nota)
    console.log("acessou nota não lida: "+ chave)
    // redireciona para a página principal
    res.redirect('/')
}