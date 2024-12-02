(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title
        return appTitle
    }

    function createTodoItemForm() {
        let form = document.createElement('form')
        let input = document.createElement('input')
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = 'Введите название нового дела'
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.textContent = 'Добавить дело'
        button.setAttribute('disabled', 'disabled')

        buttonWrapper.append(button)
        form.append(input)
        form.append(buttonWrapper)

        return {
            form,
            input,
            button,
        }
    }

    function createTodoList() {
        let list = document.createElement('ul')
        list.classList.add('list-group')
        return list
    }

    function createTodoItem(todoElement, todoArray, keyLocalStorage) {
        let item = document.createElement('li')
        let buttonGroup = document.createElement('div')
        let doneButton = document.createElement('button')
        let deleteButton = document.createElement('button')

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
        item.textContent = todoElement.name

        buttonGroup.classList.add('btn-group', 'btn-group-sm')
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'

        buttonGroup.append(doneButton)
        buttonGroup.append(deleteButton)
        item.append(buttonGroup)

        if (todoElement.done) { 
            item.classList.add('list-group-item-success')
        }


        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success')
            todoElement.done = item.classList.contains('list-group-item-success')
            saveDataToLocalStorage(keyLocalStorage, todoArray)
        })

        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                let index = todoArray.findIndex((elem) => elem.id === todoElement.id)
                todoArray.splice(index, 1)
                item.remove()
                saveDataToLocalStorage(keyLocalStorage, todoArray)
            }
        })

        return {
            item,
            doneButton,
            deleteButton,
        }
    }

    function createTodoApp(container, title = 'Список дел', listName) {
        let todoArray = getDataFromLocalStorage(listName) || []
        let todoAppTitle = createAppTitle(title)
        let todoItemForm = createTodoItemForm()
        let todoList = createTodoList()
        createTodoApp.todoArray = todoArray

        if (todoArray.length) {
            todoArray.forEach((item) => {
                let todoItem = createTodoItem(item, todoArray, listName)
                todoList.append(todoItem.item)
            })
        }

        function idForElement () { 
            if (!todoArray.length) return 1
            else return todoArray[todoArray.length - 1].id + 1
        }

        container.append(todoAppTitle)
        container.append(todoItemForm.form)
        container.append(todoList)

        todoItemForm.form.addEventListener("input", function() {
            if (!todoItemForm.input.value) {
                todoItemForm.button.setAttribute('disabled', 'disabled')
            } else {
                todoItemForm.button.removeAttribute('disabled')
            }
        })

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault()

            if (!todoItemForm.input.value) {
                return
            }

            let todoElement = {
                id: idForElement(),
                name: todoItemForm.input.value,
                done: false,
            }

            todoArray.push(todoElement)
            let todoItem = createTodoItem(todoElement, todoArray, listName) 
            saveDataToLocalStorage(listName, todoArray)

            todoList.append(todoItem.item) 
            todoItemForm.input.value = '' 
            todoItemForm.button.setAttribute('disabled', 'disabled') 
        })
    }

    function dataToJson(data) {
        return JSON.stringify(data)
    }

    function jsonToData(data) { 
        return JSON.parse(data)
    }

    function getData (listName) { 
        return localStorage.getItem(listName)
    }

    function setData (listName, data) { 
        return localStorage.setItem(listName, data)
    }

    function saveDataToLocalStorage (key, data) {
        const jsonData = dataToJson(data)
        setData(key, jsonData)
    }

    function getDataFromLocalStorage(key) {
        function getCartData () {
            let cartData = localStorage.getItem(key)
            return cartData
        }
        let result = getCartData()
        return jsonToData(result)
    }

    window.createTodoApp = createTodoApp

})()