import Route from '@ioc:Adonis/Core/Route'


Route.post('/users', 'UsersController.store')
Route.post('/session', 'SessionController.store')

Route.post('/password', 'ForgotPasswordController.store')
Route.put('/password', 'ForgotPasswordController.update')


Route.get('/files/:id', 'FilesController.show')

Route.group(() => {
    Route.resource('/projects', 'ProjectsController').apiOnly()
    Route.resource('projects.tasks', 'TasksController').apiOnly()
    Route.post('/files', 'FilesController.store')
}).middleware('auth')
