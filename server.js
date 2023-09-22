import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get('/filteredimage', async (req, res) => {
    const { image_url } = req.query;
    // Check if the image_url query parameter is provided
    if (!image_url) {
      return res.status(400).send('Image URL is required');
    }

    try {
      // Filter the image using the provided URL
      const filteredImage = await filterImageFromURL(image_url);
  
      // Send the filtered image as a response
      res.sendFile(filteredImage, () => {
        // Delete the local filtered image file after sending the response
        deleteLocalFiles([filteredImage]);
      });
    } catch (error) {
      console.log(error)
      // Handle any errors that occur during image filtering
      res.status(500).send('An error occurred while filtering the image');
    }
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
