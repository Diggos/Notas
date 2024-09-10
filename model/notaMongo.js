const mongodb = require('mongodb')
// cria uma instância do cliente do mongo
const ClienteMongo = mongodb.MongoClient;
var cliente;
// estabelece conexão com o Banco de Dados
const conexao_bd = async () => {
    if (!cliente)
        cliente = await ClienteMongo.connect('mongodb://127.0.0.1:27017');
}
// retorna o referência para o banco de dados da aplicação
const bd = () => {
    return cliente.db('notas');
}
class NotaMongo {
    async close() {
        if (cliente)
            cliente.close()
        cliente = undefined
    }
    async atualiza(nota) {
        await conexao_bd();
        const colecao = bd().collection("notas")
        await colecao.updateOne(
            { chave: nota.chave },
            { $set: { titulo: nota.titulo, texto: nota.texto, importancia: nota.importancia, lida: nota.lida } }
        )
    }

    async cria(nota) {
        await conexao_bd()
        const colecao = bd().collection("notas")
        nota.lida = Boolean(false) //toda nota deve ser criada como não lida
        await colecao.insertOne(nota)
    }

    async consulta(chave) {
        await conexao_bd()
        var c = chave
        const colecao = bd().collection("notas")
        const nota = await colecao.findOne({ chave: c })
        return nota
    }
    async deleta(chave) {
        await conexao_bd()
        var c = chave
        const colecao = bd().collection("notas")
        const doc = await colecao.findOne({ chave: c })
        if (!doc) {
            throw new Error(`Não existe a nota com chave: ${c}`)
        } else {
            await colecao.findOneAndDelete({ chave: c })
        }
    }
    async lista(query) {
        await conexao_bd()
        const colecao = bd().collection("notas")
        var notas

        if(query === "todos"){
        notas = await colecao.find({}).toArray()
        }
        else{
            await colecao.createIndex({"titulo": "text"});
            notas = await colecao.find({ $text:{$search: query}} ).toArray()
        }
        return notas
    }

    async lista_filtrada(query) {
        await conexao_bd()
        const colecao = bd().collection("notas")
        var notas;
        notas = await colecao.find(
            {
                $or: [
                    {importancia:{$in:query.filtroImportancia}},{lida:{$in:query.filtroLida}}
                ]
            }).toArray()
        console.log(notas)
        return notas
    }

    async lista_chaves() {
        await conexao_bd()
        const colecao = bd().collection("notas")
        var chaves = []
        await colecao.find({}, { projection: { _id: 0, chave: 1 } }).forEach((nota) => {
            chaves.push(nota.chave)
        })
        return chaves
    }
    
    async qtd() {
        await conexao_bd()
        const colecao = bd().collection("notas")
        const qtd = await colecao.countDocuments({})
        return qtd
    }
}
module.exports = new NotaMongo()