const express = require("express");
const cors = require("cors");
const { v4: uuid, v4: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());


function validateProjectId(request, response, next) {

  const { id } = request.params;



  if(!isUuid(id)) {

      console.log(id)
      return response.status(400).json({error: "Invalid Project ID"})
  
  }

  return next();
}


const repositories = [];

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const {title, url, techs} = request.body;


  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex == -1) {
      return response.status(400).json({error: "Project not found"})
  }


  const repository = {
      id,
      title,
      url,
      techs,
      likes:repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository


  return response.json(repository);


});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(project => project.id == id);

  console.log(repositoryIndex)
  if (repositoryIndex < 0) {
      return response.status(400).json({error: "Project not found"})
  } else {
      repositories.splice(repositoryIndex, 1);

      return response.status(204).send();
  
  }


});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params

  const repository = repositories.find(repository => repository.id == id)

  if (!repository ) {
    return response.status(400).send()
  }
  repository.likes += 1
  

  return response.json(repository)
});

module.exports = app;
