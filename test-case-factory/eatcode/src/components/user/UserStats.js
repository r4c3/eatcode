import React, { useState, useEffect } from 'react';
import { colors } from '../../global/vars';
import ProgressBar from "@ramonak/react-progress-bar";
import Peppers from '../problems/Peppers';
import Axios from "axios";
import { diffMap } from '../../global/vars';
import Bar from './Bar';

export default function ProblemSolvedCard() {
  const userDiffObject = [1, 1, 1, 5]
  const [listOfProblems, setListOfProblems] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3002/problems").then((response) => {
      setListOfProblems(response.data.result);
    });
  }, []);

  function getProblemsByDiff(diff) {
    var allProblems = listOfProblems
    var requestedProblems = []
    for (var i = 0; i < allProblems.length; i++) {
      if (allProblems[i].diff === diffMap.indexOf(diff))
      requestedProblems.push(allProblems[i])
    }
    return requestedProblems
  }

    const styles = {
        card: {
            display: "inline-box",
            color: "white",
            position: 'absolute',
            marginTop: "310px",
            marginLeft: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: colors.accent1,
            borderRadius: "10px",
            boxShadow: "0px 1px 10px 1px black"
        },
        upperContainer: {
            height: "75px",
            backgroundColor: colors.accent2,
            textAlign: "center",
        },
        lowerContainer: {
            height: "270px",
            background: colors.accent1,
            textAlign: "center",
            marginTop: "30px"
        }
    }

    return (
        <div style={styles.card}>
            <div style={styles.upperContainer}>
                <br/>
                <br/>
                <h5>Beef Stats</h5>
            </div>
            <div style={styles.lowerContainer}>
                <Bar diff={"Bell"} completed={diffMap.indexOf("Bell")} maxCompleted={getProblemsByDiff("Bell").length} bgColor={colors.Bell}/>
                <Bar diff={"Jalepeño"} completed={diffMap.indexOf("Jalepeño")} maxCompleted={getProblemsByDiff("Jalepeño").length} bgColor={colors.Jalepeño}/>
                <Bar diff={"Habenero"} completed={diffMap.indexOf("Habenero")} maxCompleted={getProblemsByDiff("Habenero").length} bgColor={colors.Habenero}/>
                <Bar diff={"Ghost"} completed={diffMap.indexOf("Ghost")} maxCompleted={getProblemsByDiff("Ghost").length} bgColor={colors.Ghost}/>
            </div>
        </div>
    )
}