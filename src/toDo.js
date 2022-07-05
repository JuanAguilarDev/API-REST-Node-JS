const colors = require('colors');
const dir = require('path');
const fs = require('fs');
const path = dir.join(__dirname, './data/task.json');

// Intialize the path
const initialize = () => {
    try {
        if(!fs.existsSync(path)) {
            fs.writeFileSync(path, '[]')
        }
    }catch (err) {
        console.log(err);
    }
    console.log('Listo')
}

let toDo = JSON.parse(fs.readFileSync(path, 'utf8'));

const getToDo = () => toDo;

const createToDo = (tittle, description, status) => {
    const id = toDo.length+1;
    const newToDo = {
        id,
        tittle,
        description,
        status
    }
    
    toDo.push(newToDo);
    fs.writeFileSync(path, JSON.stringify(toDo));
}

const deleteToDo = (id) => {
    let index = toDo.findIndex(todo => todo.id == id);
    if(index == -1){
        console.log(`The task with the id: ${id} has not been found`.red);        
    }else{
        let data = toDo.filter(e => e.id === id-1);
        console.log(data);
        fs.writeFileSync(path, JSON.stringify(data));
        console.log(`The task: ${toDo[index].tittle} has been deleted. `);
    }
}

module.exports = {
    getToDo, 
    deleteToDo, 
    createToDo,
    initialize
}