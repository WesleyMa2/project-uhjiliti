class Routes {
  constructor(){
    this.routes = []
  }

  addRoute(method, path, handler) {
    this.routes.push(new Route(method, path, handler))
  }

  getRoutes() {
    return this.routes
  }
}

class Route {
  constructor(method, path, handler){
    this.method = method
    this.path = path
    this.handler = handler
  }
}

module.exports = Routes