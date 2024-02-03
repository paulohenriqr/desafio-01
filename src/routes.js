import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/buuild-route-path.js"


const database = new Database()


export const routes = [

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            const tasks = database.select('tasks', search? {
                title: search,
                description: search
            }: null)
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: null,
                updated_at: null
            }
            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    }
] 