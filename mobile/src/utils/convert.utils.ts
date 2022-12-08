

export function dateStr(date: Date|string) {
    const d = typeof date === "string" ? new Date(date) : new Date(date.toLocaleDateString('pt-BR'));
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    var yy = d.getFullYear();
    return dd.toString().padStart(2, '0') + '/' + mm.toString().padStart(2, '0') + '/' + yy;
}


export const getMoney = (value: number|null) => {
    return 'R$ ' + ( value ? value.toFixed(2).replace('.', ',') : '0,00');
}