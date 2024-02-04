import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/buuild-route-path.js"
import { DateTime } from 'luxon';


const database = new Database()


export const routes = [

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            console.log("entrou no post")
            const { title, description } = req.body
            if (title && description) {
                const currentDate = DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss');
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: currentDate,
                    updated_at: null
                }
                database.insert('tasks', task)
                return res.writeHead(204).end()
            } else {
                return res.writeHead(400).end('Por favor, preeencher title e description')
            }
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const currentDate = DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss');
            const { id } = req.params
            const { title, description } = req.body
            const data = {}
            data.updated_at = currentDate
            if (title) data.title = title
            if (description) data.description = description
            const updateTask = database.update('tasks', id, data)
            if (updateTask) {
                return res.writeHead(204).end()
            }
            else {
                return res.writeHead(400).end()
            }

        }
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            if (id) {
                const deleteTask = database.detete('tasks', id)
                if (deleteTask) {
                    return res.writeHead(204).end()
                } else {
                    return res.writeHead(400).end('Insira um id exixtente.')
                }
            } else {
                return res.writeHead(400).end('Insira um id, por favor.')
            }


        }

    }
] 