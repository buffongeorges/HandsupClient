import React, { useState } from "react";
import Papa from "papaparse";
import Form from "react-bootstrap/Form";

import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const allowedExtensions = ["csv"];

export default function Uploader() {
  const [data, setData] = useState([]);
  let navigate = useNavigate();


  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      console.log(e.target.files.length);

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
    else {
        setFile(null)
    }
  };
  const handleParse = (e) => {
    alert('Import réussi !');
    console.log('clické ok');
    navigate("/classes");

    // e.preventDefault();

    // If user clicks the parse button without
    // a file we show a error
    // if (!file) return setError("Enter a valid file");

    // // Initialize a reader which allows user
    // // to read any file or blob.
    // const reader = new FileReader();

    // // Event listener on reader when the file
    // // loads, we parse it and set the data.
    // reader.onload = async ({ target }) => {
    //   const csv = Papa.parse(target.result, { header: true });
    //   const parsedData = csv?.data;
    //   const columns = Object.keys(parsedData[0]);
    //   setData(columns);
    // };
    // reader.readAsText(file);
  };

  return (
    <div
      style={{
        textAlign: "center",
        position: "relative",
        justifyContent: "center",
        paddingTop: "2rem",
      }}
    >
      <Form.Group
        controlId="formFile"
        className="mb-3 container"
        style={{ width: "30rem" }}
      >
        <Form.Label>Choisir le fichier des élèves</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>

      <Button
        id="login-button"
        block="true"
        size="lg"
        type="submit"
        disabled={!file}
        onClick={handleParse}
      >
        Importer classe
      </Button>

    </div>
  );
}
