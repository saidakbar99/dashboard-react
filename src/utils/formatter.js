export function numberFormatter(num) {
    if(num){
        return num.toLocaleString('en-Us').split(',').join(' ')
    }else{
        return true
    }
}

export function dateFormatter(date) {
    const withoutMilliSeconds = date.split('.').slice(0,1)
    const dateNtime =  withoutMilliSeconds.toString().split('T')
    const formattedDate = dateNtime[0].toString().split('-').reverse().join('.')
    const formattedTime = dateNtime[1].split(':').splice(0,2).join(':')
    return formattedDate + ' ' + formattedTime
}

export function dateFormatterWithoutTime(date) {
    if(date){
        const onlyDate =  date?.toString()?.split('T')
        const formattedDate = onlyDate[0].split('-').reverse().join('.')
        return formattedDate
    }else{
        return true
    }
    
}

export function onlyNumbers(event) {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
}