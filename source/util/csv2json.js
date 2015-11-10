'use strict';
import fs         from 'fs';
import replaceAll from './replace-all';
import sanitize   from './sanitize-str';
import path       from 'path';
import { files }  from '../../config.json';

function f(str) {
	let _path = str.toLowerCase().replace('table:','').trim();
    _path = path.resolve(files.base, _path);
	let data = fs.readFileSync(_path, 'utf-8');
	return csv2json(data);
}

export default function csv2json(csv) {
    csv = replaceAll(csv, '\r', '');
    let result = [];
    let lines = csv = csv.split('\n');

    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split(';');
    }

    let headers = lines.shift();
	//erro no parse
    for (let i = 0; i < headers.length; i++) {
        headers[i] = sanitize(headers[i]);
    }


    for (let y = 0; y < lines.length; y++) {
    	let line = lines[y];
    	let propName;
    	let obj = {};

    	for (let i = 0; i < headers.length; i++) {
    		if(line[i]) {
				propName = headers[i];
	            obj[propName] = line[i];
	            if (line[i].indexOf('table:') === 0){
	                obj[propName] = f(obj[propName]);
	            }
			}
    	}
        if( Object.keys(obj).length > 0 ) result.push(obj);

    }
    return result;
}
