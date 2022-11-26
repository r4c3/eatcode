import React from 'react'
import { colors } from '../global/vars'
import { useState, createContext  } from 'react'
import Axios from 'axios'
import View from '../components/create/View'
import Tags from '../components/create/Tags'


const Create = () => {

  const styles = {
    content: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      justifyContent: 'space-between',
      backgroundColor: colors.grey
    },
    left: {
      backgroundColor: colors.accent2,
      width: '50%',
      height: '100%',
    },
    right: {
      backgroundColor: colors.accent1,
      maxWidth: '50%',
      width: '50%',
      height: '100%',
    },
    form: {
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'center',
      margin: "0 1% 0 1%",
    },
    label: {
      fontSize: "2rem",
    },
    input: {
      width: "50%",
      padding: "8px",
      // margin: "8px 0",
      boxSizing: "border-box",
    },
    textarea: {
      height: "5vh",
    }
  }
  
  const UserContext = createContext()
  const fileInput = document.getElementById('fileInput');
  const [checkedTags, setCheckedTags] = useState([]);
  const [inputs, setInputs] = useState({
    difficulty: 1,
    time: 1,
    memory: 256,
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if(event.target.type === "checkbox") {
      if(event.target.checked === true && !checkedTags.includes(event.target.name)) {
        setCheckedTags(values => [...values, event.target.name]);
      } else if(event.target.checked === false) {
        setCheckedTags(checkedTags.filter(tag =>  tag !== event.target.name));
      }
    } else {
      setInputs(values => ({...values, [name]: value}));
    }
  }

  const resetForm = () => {
    setInputs({
      difficulty: 1,
      time: 1,
      memory: 256,
    });
    fileInput.value = "";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fileInput.value === null || fileInput.value === "") {
      alert("Please submit a file");
      return;
    }
    let questionID = -1;
    Axios.get("http://localhost:3002/findLastPost").then((response) => {
      questionID = response.data.questionID;
      console.log(questionID);
      Axios.post("http://localhost:3002/create", {
        questionID,
        name: inputs.name,
        diff: inputs.difficulty,
        time: inputs.time,
        memory: inputs.memory,
        status: 0,
        text: inputs.text,
        input: inputs.input,
        output: inputs.output,
        example: {
          exampleInput: inputs.exampleInput,
          exampleOutput: inputs.exampleOutput,
          exampleText: inputs.exampleText,
        },
        numberOfAttemptedUsers: 0,
        numberOfSolvedUsers: 0,
        tags: checkedTags,
      }).then((response) => {
        console.log("Created Problem");

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };

        const fileData = new FormData();
        fileData.append("zippedFile", fileInput.files[0]);
        fileData.append("questionID", questionID);


        Axios.post("http://localhost:3002/createFiles", fileData, config).then((response) => {
          console.log(response.data);
        }).catch((error) => {
          console.log("Something went wrong with Problem Files");
          console.log(error);
        })

        resetForm();

      }).catch((error) => {
        console.log("Something went wrong with Problem Data");
        console.log(error);
      })
    }).catch((error) => {
      console.log("Something went wrong with retrieving last problem index");
      console.log(error);
    })
  };

  return (
    <div style={styles.content}>
      <div style={styles.left}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Problem Name:
            <input 
              style={styles.input}
              type="text" 
              name="name"
              value={inputs.name || ""}
              onChange={handleChange}
            />
          </label>
          <label style={styles.label}>
            Difficulty:
            <select name="difficulty" value={inputs.difficulty || 1} onChange={handleChange}>
              <option value={0}>Bell</option>
              <option value={1}>Jalepeño</option>
              <option value={2}>Habenero</option>
              <option value={3}>Ghost</option>
            </select>
          </label>
          <label style={styles.label}>
            Time Limit:
            <select name="time" value={inputs.time || 1} onChange={handleChange}>
              <option value={0.5}>0.5s</option>
              <option value={1}>1s</option>
              <option value={2}>2s</option>
              <option value={3}>3s</option>
            </select>
          </label>
          <label style={styles.label}>
            Memory Limit:
            <select name="memory" value={inputs.memory || 256} onChange={handleChange}>
              <option value={256}>256MB</option>
              <option value={512}>512MB</option>
            </select>
          </label>
          <label style={styles.label}>
            Problem Text:
          </label>
          <textarea 
              style={styles.textarea}
              name="text"
              value={inputs.text || ""}
              onChange={handleChange}
            /> 
          <label style={styles.label}>
            Input Description:
          </label>
          <textarea 
              style={styles.textarea}
              name="input"
              value={inputs.input || ""}
              onChange={handleChange}
            /> 
          <label style={styles.label}>
            Output Description:
          </label>
          <textarea 
              style={styles.textarea}
              name="output"
              value={inputs.output || ""}
              onChange={handleChange}
            />
          <label style={styles.label}>
            Example Input:
          </label>
          <textarea 
              style={styles.textarea}
              name="exampleInput"
              value={inputs.exampleInput || ""}
              onChange={handleChange}
            /> 
          <label style={styles.label}>
            Example Output:
          </label>
          <textarea 
              style={styles.textarea}
              name="exampleOutput"
              value={inputs.exampleOutput || ""}
              onChange={handleChange}
            /> 
          <label style={styles.label}>
            Example Text:
          </label>
          <textarea 
              style={styles.textarea}
              name="exampleText"
              value={inputs.exampleText || ""}
              onChange={handleChange}
            /> 
          <label  style={styles.label}>Problem Tags</label>
          <Tags handleChange={handleChange}/>
          <label style={styles.label}>Choose a zip file with all the test cases</label>
          {/* <input id='fileInput' type="file" name='file' accept=".zip,.7zip" /> */}
          <input id='fileInput' type="file" name='file'/>
          <input type="submit" onSubmit={handleSubmit}/>
        </form>
      </div>
      <div style={styles.right} className="preview-container">
        <UserContext.Provider value={inputs}>
          <View context={UserContext} preview={true}></View>
        </UserContext.Provider>
      </div>
    </div>
  )
}

export default Create