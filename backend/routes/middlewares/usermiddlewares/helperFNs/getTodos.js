const { Todos } = require("../../../../db/db")

const getTodos = async(userID)=>{
    let todos = await Todos.find({
        userId : userID
    })

    return todos;
}



module.exports = {
    getTodos
}