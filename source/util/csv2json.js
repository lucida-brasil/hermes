'use strict';
import fs         from 'fs';
import replaceAll from './replace-all';

function f(str) {
	let _path = str.toLowerCase().replace('table:','').trim();
	let data = fs.readFileSync(_path, 'utf-8');
	return csv2json(data);
}

export default function csv2json(csv) {
    csv = replaceAll(csv, '\r', '');
    var lines=csv.split('\n');
    var result = [];
    var headers=lines.shift().split(';');
    lines.pop();

    lines.forEach((line) => {
        line = line.split(';');
        var o = {};
        headers.forEach((prop, index) => {
            o[prop] = line[index];
			if (o[prop].indexOf('table:') === 0) {
				o[prop] = f(o[prop]);
			}
        });
        result.push(o);
    });

    return result;
}
