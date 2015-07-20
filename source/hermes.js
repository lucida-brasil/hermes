import fs      from 'fs';
import path    from 'path';
import easyzip from 'easy-zip';
import program from 'commander';
import config  from '../config.json';
import Mail    from './mail.class';
import smtp    from './smtp';

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

function zipAttachment(attachments, cb){
    attachments = attachments ? attachments.split(',') : [];
    var zip  = new easyzip.EasyZip();
    var p    = attachments[0] || false;

    if (p) {
        let last_char = p[p.length -1];
        let rnd       = Math.round(Math.random() * 1000000);
        let zip_dir   = path.join(__dirname,`../tmp/${rnd}.zip`);

        if ( '\\' === last_char || '/' === last_char ) {
            zip.zipFolder(p, () => zip.writeToFile(zip_dir, function(){
                if (cb) cb(zip_dir);
            }));
        }
        else if (cb) cb(p);
    }
    else if (cb) cb(null);
}

function sendMailing(dir){
	console.log(`Disparando emails de ${dir}`);
    fs.readFile(
    	dir,
	    'utf-8',
	    (err, data) => {
	        var mailing = csv2json(data);

	        mailing.forEach(function(opts){
	            opts.to = replaceAll(opts.to, ' ', '').split(',');

	            zipAttachment(opts.attachments, (zip_path) => {
	                var attach = zip_path ? [zip_path] : undefined;
	                (new Mail(
	                    config.email.user,
	                    opts.to,
	                    opts.message,
	                    opts.subject,
	                    attach
	                )).send(smtp);
	            });
	        });
	    }
	);
}

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
