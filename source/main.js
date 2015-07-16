import fs     from 'fs';
import path   from 'path';
import Mail   from './mail.class';
import config from '../config.json';
import smtp   from './smtp';

// var m = new Mail(
//     config.email.user,
//     [
//         'ortense@lucida.com.br',
//         'vinicius@lucida.com.br'
//     ],
//     'Oi isso é um teste<br>Se você recebeu esse email, você é uma cobaia!<br><b>Hermes</b>',
//     'Mais um email para você (:',
//     path.resolve(__dirname, '../__hermes.zip')
// );
//
// m.send(smtp);

var base_dir = path.resolve(config.files.base);
var folders  = fs.readdirSync(base_dir);


function replaceAll(str, token, newtoken) {
	while (str.indexOf(token) !== -1) {
		str = str.replace(token, newtoken);
	}
	return str;
};

function csv2json(csv){
    csv = replaceAll(csv, '\r', '');
    var lines=csv.split('\n');
    var result = [];
    var headers=lines.shift().split(';');
    lines.pop();

    lines.forEach(function(line){
        line = line.split(';');
        var o = {};
        headers.forEach(function(prop, index){
            o[prop] = line[index];
        });
        result.push(o);
    });

    return result;
}

var dir = path.join(base_dir, 'm1/mailing.csv');

fs.readFile(
    dir,
    'utf-8',
    (err, data) => {
        var mailing = csv2json(data);

        mailing.forEach(function(opts){
            opts.to = replaceAll(opts.to, ' ', '').split(',');

            var mail = new Mail(config.email.user, opts.to, opts.message, opts.subject);
            mail.send(smtp);
        });
    }
);
