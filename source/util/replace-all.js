'use strict';

export default function replaceAll(str, token, newtoken) {
	while (str.indexOf(token) !== -1) {
		str = str.replace(token, newtoken);
	}
	return str;
}
