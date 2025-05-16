/**
 * 
 * @param date - date string
 * @returns - formatted date string in 'dd/MM/yyyy' format
 */
export function parseDate(date: string): string {
	return new Date(date).toLocaleString('it-IT', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

/**
 * 
 * @param stringDate - date string
 * @returns - formatted date string in 'dd/MM/yyyy, HH:mm' format
 */
export function formatData(stringDate: string) {
  return new Date(stringDate).toLocaleString('it-IT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome'
  });
}