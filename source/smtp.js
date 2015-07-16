import config  from '../config.json';
import email   from 'emailjs/email';

export default email.server.connect(config.email);
