import fs   from 'fs';
import hbs  from 'handlebars';
import path from 'path';
import mime from './mime.json';

export default class Mail {
    constructor(
        sender,
        receivers,
        message,
        subject = '(sem assunto)',
        attachments = [],
        template = 'default'
    ) {
        this.sender      = sender;
        this.receivers   = receivers;
        this.subject     = subject;
        this.message     = message;
        this.template    = `${template}.hbs`;
        this.attachments = attachments;
    }

    make () {
        var dir      = path.resolve(__dirname, '../templates/');
        var source   = fs.readFileSync(path.join(dir, this.template), 'utf-8');
        var template = hbs.compile(source);
        var html     = template({
                message : this.message
            });
        var msg = {
                text: this.message,
                from: `"Hermes, O carteiro" <${this.sender}>`,
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

            console.log({
                path: attach,
                type: mime[extension] || 'text/plain',
                name: file_name
            });

            msg.attachment.push({
                path: attach,
                type: mime[extension] || 'text/plain',
                name: file_name
            });
        });

        return msg;
    }

    send (smtp) {
        var message = this.make();
        smtp.send(
            message,
            (error, info) => {
                if (error) return console.log(error);
                console.log('Message sent: ', info);
        });
    }
}
