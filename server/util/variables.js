module.exports.replaceVariables = (message, variables) => {
    for (const variable in variables)
        message = message.replace(`%${variable}%`, variables[variable]);
    return message;
}