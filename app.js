// const { request, response } = require("express");
const { response } = require("express");
const express = require("express");

const fs = require("fs");
// const { join } = require("path");
const app = express();

const port = 5000; // OR 3000 smae but 5000 is better
app.use(express.json());

// let movies = [];
const writeToFile = (movies) => {
    fs.writeFile("./data.json", JSON.stringify(movies), () => {
      console.log("Added successfully");
    });
};
 
// console.log(movies);

/// Disply by Query ************************
app.get("/disply", (request, response) => {
    fs.readFile("./data.json", (err , data ) => {
         const id = request.query.id;
         const movies = JSON.parse(data.toString());

         if (id) 
         {
            const getAllTrue = movies.filter(
              (movie) => movie.id == id && movie.isDeleted != true );
              getAllTrue.length ? response.status(200).json(getAllTrue)
              : response.status(404).json("Not Found 404 ..!!");
          } 
          else 
          {
            const getAllTrue = movies.filter(
              (movie) => movie.isDeleted != true
            );
            response.status(200).json(getAllTrue);
          }
    });
});

      /// Disply by ID Params **************
app.get("/disply_Item/:id", (request, response) => {
    fs.readFile("./data.json", (err , data ) => {

        const movies = JSON.parse(data.toString());
        const movie = movies.find((movie) => movie.id == request.params.id && movie.isDeleted != true);
      
        if (movie) 
        {
            response.status(200).json(movie);
        } 
        else 
        {
            response.status(404).json("Not Found");
        }
    });
});

      /// Add new movie 
app.post("/new_movie", (request, response) => 
{
    fs.readFile("./data.json", (err, data) => 
    {
    const movies = JSON.parse(data.toString());
     //   const { id, name, isFalse, isDeleted } = request.body;
      movies.push({ 
      id : movies.length +1  , 
      movie: request.body.movie, 
      isFalse: false, 
      isDeleted: false,
     });
     writeToFile(movies);
  
  const newMovie = movies.filter((movie) => movie.isDeleted === !true);
  response.status(200).json(newMovie);
    });
});
 

app.put("/update/:id/:newName", (request, response) => 
{
    fs.readFile("./data.json", (err, data) => 
    {
    const movies = JSON.parse(data.toString());

    movies.forEach((elem) => {
        if (elem.id == request.params.id) elem.movie = request.body.movie;
      
    });
  
    writeToFile(movies);
    
  let newMovie = movies.filter((e) => e.isDeleted === "false");
  response.status(200).json(newMovie);
   });
});

app.delete("/remove/:id", (request, response) => 
{
    fs.readFile("./data.json", (err, data) => 
    {
    const movies = JSON.parse(data.toString());

    movies.forEach((element) => 
    {
        if (element.id == request.params.id) 
        {
            element.isDeleted = true; 
        }
    });  
    writeToFile(movies); 
    let newMovie = movies.filter((e) => e.isDeleted === "false");
    response.status(200).json(newMovie);

  });
 
}); 

app.listen(port, () => {
  console.log(` The Server is running on port ${port} ...`);
});
