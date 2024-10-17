var http = require('http');
var fs = require('fs');
var url = require('url');
const sqlite3 = require('sqlite3').verbose();
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var nomearquivo = "." + q.pathname;
    if(nomearquivo == "./"){
      fs.readFile("index.html", function(err, data) {
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Arquivo não encontrado!");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
    else if(nomearquivo == "./formulario.html"){
      fs.readFile(nomearquivo, function(err, data) {
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Arquivo não encontrado!");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
    else if(nomearquivo == "./registra"){
      let nome = q.query.nome;
      let genero = q.query.genero;
      let pagina = q.query.pagina;
      let db = new sqlite3.Database('./../db/banco.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Conectou com o banco de dados!');
      });
    
      // insere um registro no banco de dados
      db.run(`INSERT INTO Livros(nome, genero, pagina) VALUES(?,?,?)`, [nome,genero,pagina], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // Pega o id do último registro inserido
        console.log(`Registro feito com sucesso no id ${this.lastID}`);
      });
    
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Fechou a conexão com o banco de dados!');
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("<p>Registro efetuado com sucesso!</p>");
      res.write("<p><a href='/'>Voltar</a></p>");
      return res.end();
    }
    else if(nomearquivo == "./ver_usuarios"){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("<html><head><meta charset='UTF-8'><title>Usuários</title></head><body>");
      res.write("<h1>Usuários Cadastrados</h1>");

      let db = new sqlite3.Database('./db/banco.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Conectou com o banco de dados!');
      });

       db.all(`SELECT * FROM usuario`, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }

            res.write("<table border='1'>");
            res.write("<tr>");
            res.write("<th>Nome</th>");
            res.write("<th>E-mail</th>");
            res.write("<th>Senha</th>");
            res.write("</tr>");
            rows.forEach((row) => {
            res.write("<tr>");
            res.write("<td>"+row.nome+"</td>");
            res.write("<td>"+row.genero+"</td>");
            res.write("<td>"+row.pagina+"</td>");
            res.write("</tr>");
        });
            res.write("</table>");
            res.write("<p><a href='/'>Voltar</a></p>");
            res.write("</body></html>");
            return res.end();
      });

      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Fechou a conexão com o banco de dados!');
      });
    }
    else if (nomearquivo.endsWith('.jpg')) {
      retorno_imagem(res,nomearquivo)
    }
    else if (nomearquivo.endsWith('.css')) {
      css(res,nomearquivo)
    }
    }).listen(8080, () => {
    console.log("O servidor foi iniciado na porta 8080");
});

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
      if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Erro ao carregar o arquivo.');
      } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
      }
  });
}
function retorno_imagem(res,nomearquivo){
  serveFile(res,`${nomearquivo}`,'image/jpeg',function (err, data){
    return data
  });
}
function css(res,nomearquivo){
  serveFile(res,`${nomearquivo}`,'text/css',function (err, data){
    if(err){
      console.log(err)
    }
    return data
  });
}