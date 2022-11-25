import React from 'react'
import { MathComponent } from 'mathjax-react'
import { useState, useEffect } from 'react'

const Text = ({ id, text }) => {

  const styles = {
    p: {
      display: "inline",
      whiteSpace: "pre-wrap",
    },
    error: {
      color: "red",
      fontWeight: "bold",
    }
  }

  const [filteredText, setFilteredText] = useState([]);
  let isLatex = false;

  const appendToPreview = (element, i) => {
    if(isLatex) {
      isLatex = false;
      return (
        <MathComponent key={i} tex={element} display={false} />
      )
    }
    else {
      isLatex = true;
      return (
        <p key={i} style={styles.p}>{element}</p>
      )
    }
  }

  useEffect(() => {
    if(text !== undefined) {
      const pattern = new RegExp("[$]{2}");
      isLatex = false;
      setFilteredText(text.split(pattern));
    }
  }, [text])

  return (
    <div id={id}>
      {filteredText.map((data, i) => {
        return appendToPreview(data, i);
      })}
    </div>
  )
}

export default Text