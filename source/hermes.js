import program from 'commander';
import pack    from '../package.json';
import sender  from './sender'

//command line
program
	.version(pack.version)
	.option(
		'-m, --mailing [file]',
		'Send emails from a specified mailing',
		sender.mailing
	)
	.option(
		'-a, --all',
		'Send all mailings from base folder',
		sender.all
	).parse(process.argv);
