export default function (str, only_word_character) {
	str = str.trim()
			.toLowerCase() 
			.replace(/\s+/g, ' ')
			.replace(/\s+/g, '_')
			.replace(/[áàâãåäæª]/g, 'a')
			.replace(/[éèêëЄ€]/g, 'e')
			.replace(/[íìîï]/g, 'i')
			.replace(/[óòôõöøº]/g, 'o')
			.replace(/[úùûü]/g, 'u')
			.replace(/[ç¢©]/g, 'c')
			.replace(/\:/g,'_')
			.replace(/\./g,'_');
	if (only_word_character) {
		str = str.replace(/[^a-z0-9\-]/g, '_')
				.replace(/_+/g, '_');
	}
	return str;
}