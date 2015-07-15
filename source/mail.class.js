class Mail {
    constructor(sender, receiver, subject, message, attach) {
        this.sender   = sender;
        this.receiver = receiver;
        this.subject  = subject;
        this.message  = message;
        this.attach   = attach;
    }
    make () {
        // aplicar template
        // adicionar anexos
        // instanciar transporter
        console.log('run make');
    }
    send () {
        // envar email
        console.log('run save');
    }
}

export default Mail
