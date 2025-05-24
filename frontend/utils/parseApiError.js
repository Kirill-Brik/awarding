export default function (error) {
    let errors = {}
    if (error.details && error.details.errors)
        error.details.errors.forEach((detail) => {
            errors[detail.path[0]] = detail.message
        })
    else errors.main = error.message
    return errors
}