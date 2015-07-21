import fs      from 'fs';
import path    from 'path';
import easyzip from 'easy-zip';
import program from 'commander';
import config  from '../config.json';
import Mail    from './mail.class';
import smtp    from './smtp';

//tratamento de string
function replaceAll(str, token, newtoken) {
	while (str.indexOf(token) !== -1) {
		str = str.replace(token, newtoken);
	}
	return str;
};

//recebe a string do csv e converte para um objeto
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

//monta a estrutura de anexo com ou sem zip
function buildAttachment(attachments, cb){
    attachments = attachments ? attachments.split(',') : [];
    var zip  = new easyzip.EasyZip();
    var p    = attachments[0] || false;

    if (p) {
        let last_char = p[p.length -1];
        let rnd       = Math.round(Math.random() * 1000000);
        let zip_dir   = path.join(__dirname,`../tmp/${rnd}.zip`);
		// é uma pasta?
        if ( '\\' === last_char || '/' === last_char ) {
            zip.zipFolder(p, () => zip.writeToFile(zip_dir,() => {
                if (cb) cb([zip_dir]);
            }));
        }
        else {
			var attach = [];
			attachments.forEach((file) => {
				file = (file||'').trim();
				let tmp  = file.split('\\');
				let ext = tmp[tmp.length -1].split('.')[1];
				//é um arquivo com extensão
				if ( ext ) {
				    attach.push(file);
				}
			});
			if (cb) cb(attach);
		}
    }
    else if (cb) cb(null);
}

//apaga arquivos temporarios
function clear(files) {
	if (files) {
		files.forEach((zpath)=>{
			if (zpath.indexOf('/tmp/') >=0 || zpath.indexOf('\\tmp\\') >=1) {
				fs.unlink(zpath, (err) => {
					if (err) console.log(err);
				});
			}
		});
	}
}

//recebe o mailing e dispara os emails
function sendMailing(dir){
	console.log(`Disparando emails de ${dir}`);
    fs.readFile(
    	dir,
	    'utf-8',
	    (err, data) => {
	        var mailing = csv2json(data);

	        mailing.forEach(function(opts){
	            opts.to = replaceAll(opts.to, ' ', '').split(',');

	            buildAttachment(opts.attachments, (attach) => {
	                (new Mail(
	                    config.email.user,
	                    opts.to,
	                    opts.message,
	                    opts.subject,
	                    attach
	                )).send(smtp, (err, info) => {
						if(err) console.log(err);
						else console.log(`email send at ${info.header.date}`);
						clear(attach);
					});
	            });
	        });
	    }
	);
}

//funções utilizadas pela CLI
var send = {
	mailing(dir){
		dir = path.resolve(process.cwd(), dir);
		sendMailing(dir);
	},
	all(){
		var base_dir = path.resolve(config.files.base);
		var folders  = fs.readdirSync(base_dir);
		folders.forEach(function(folder){
		    var dir = path.join(base_dir, `${folder}/mailing.csv`);
		    sendMailing(dir);
		});
	}
}

console.log('\n**HERMES INIT**\n');
program
	.version('0.0.1')
	.option('-m, --mailing [file]', 'run one mailing', send.mailing)
	.option('-a, --all', 'send all mailings in base folder', send.all)
	.parse(process.argv);
