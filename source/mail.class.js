import fs     from 'fs';
import hbs    from 'handlebars';
import path   from 'path';
import mime   from './mime.json';
import config from '../config.json';

export default class Mail {
    constructor(
        sender,
        receivers,
        subject = '(sem assunto)',
        dataLayer,
        attachments = [],
        template
    ) {
        template = template || 'default';
        this.sender      = sender;
        this.receivers   = receivers;
        this.subject     = subject;
        this.dataLayer   = dataLayer;
        this.template    = `${template}.hbs`;
        this.attachments = attachments || [];
    }

    make () {
        let dir      = path.resolve(__dirname, '../templates/');
        let source   = fs.readFileSync(path.join(dir, this.template), 'utf-8');
        let template = hbs.compile(source);
        let html     = template(this.dataLayer);
        let msg = {
                text: this.dataLayer,
                from: `"${config.sender_name}" <${this.sender}>`,
                to: (this.receivers||[]).join(','),
                subject: this.subject,
                attachment: [
                    { data: html, alternative:true }
                ]
            };

        this.attachments.forEach(function(attach){
            var file_name = attach.split('\\');
            file_name = file_name[file_name.length -1];
            var extension = file_name.split('.')[1];

            msg.attachment.push({
                path: attach,
                type: mime[extension] || 'text/plain',
                name: file_name
            });
        });

        return msg;
    }

    send (smtp, cb) {
        var message = this.make();
        smtp.send(
            message,
            (error, info) => {
                if('function' === typeof cb) cb(error, info)
            }
        );
    }
}