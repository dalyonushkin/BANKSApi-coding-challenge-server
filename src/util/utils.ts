/**
 * Validation utils
 * We have very simple requirements for data validation, we should enough this functions. 
 * For complex app it is preferred to use something like  https://www.npmjs.com/package/joi or https://www.npmjs.com/package/express-validator
 */

export function isValidNumber(value: string | number) {
    if ((typeof value === "number") && !isNaN(value)) return true;

    return ((typeof value === "string")) && !isNaN(parseFloat(value))&& /^[+-]{0,1}\d*[\.]{0,1}\d*$/.test(value);
}
export function isValidString(value: string) {
    return typeof value === "string";
}

//source https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
export function isValidDate(dateString: string) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}

