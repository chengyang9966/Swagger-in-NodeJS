const restMethod={
    POST:'POST',
    GET:'GET',
    PATCH:'PATCH',
    PUT:'PUT',
    DELETE:'DELETE'
}

const requiredAuthPath={
    '/posts':[restMethod.POST,restMethod.GET,restMethod.PUT]
};


export {
    restMethod,
    requiredAuthPath
}