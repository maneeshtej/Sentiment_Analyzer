import React, { useState } from "react";
import axios from "axios";
import "./emotionclassifier.css";

function EmotionClassifier() {
  const [inputText, setInputText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");
  const labels = ["Sadness", "Joy", "Love", "Anger", "Fear", "Suprised"];
  const [buttonPress, setButtonPress] = useState(false);
  const [dynamicClassName, setDynamicClassName] = useState("");
  const [samplesOpen, setSamplesOpen] = useState(false);
  const sentimentSamples = [
    [
      "I love spending time with my family. They always make me feel supported.",
    ], // Positive
    [
      "The service at the restaurant was terrible. I don’t think I’ll ever go back.",
    ], // Negative
    ["It’s a sunny day outside.", "I might take a walk later."], // Neutral
    [
      "I’m so excited about the new movie release!, I’ve been waiting for it all year.",
    ], // Positive
    ["I’m disappointed with my test results.", "I thought I had done better."], // Negative
    ["The meeting went as expected.", "There were no major surprises."], // Neutral
    [
      "Winning the competition felt amazing!, All the hard work finally paid off.",
    ], // Positive
    [
      "The traffic today is frustrating. I’ve been stuck in the same spot for 20 minutes.",
    ], // Negative
    ["The book I’m reading is okay. It’s neither great nor terrible."], // Neutral
    [
      "I’m thrilled to start my new job next week!, It’s a big step forward in my career.",
    ], // Positive
  ];

  const setClassName = async (buttonPress) => {
    if (buttonPress) {
      console.log("Processing...");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("emotion-made-by-transform");
        }, 3000);
      });
    }
    return "default-class";
  };

  const handleButtonClick = async () => {
    setButtonPress(true);
    const className = await setClassName(true);
    setDynamicClassName(className);
  };

  const handleClassify = async () => {
    setError("");

    if (!inputText) {
      setError("Please enter some text.");
      return;
    }

    try {
      const response = await axios.post(
        "https://d038-103-246-193-34.ngrok-free.app/predict",
        {
          text: inputText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPredictions(response.data[0]);
      console.log(response.data);
    } catch (err) {
      setError("Error connecting to the server or invalid response.");
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
      <h1 className={`emotion-made-by ${dynamicClassName}`}>
        A project by <br></br>Maneesh
      </h1>
      <div
        className={`emotion-main-wrapper ${
          !buttonPress ? " " : "emotion-main-wrapper-transform"
        }`}
      >
        <h1>Emotion Classifier</h1>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to classify emotions"
          rows="4"
          className={`${
            !buttonPress ? "emotion-textbox" : "emotion-textbox-transform"
          }`}
          style={{
            fontSize: `${buttonPress ? "20px" : "10px"}`,
          }}
        />
        <div className="emotion-button-flex">
          <button
            onClick={() => {
              handleClassify();
              handleButtonClick();
            }}
            className="emotion-button"
            style={{
              fontSize: `${buttonPress ? "20px" : "10px"}`,
            }}
          >
            Classify Emotion
          </button>
          <button
            onClick={() => {
              setSamplesOpen(true);
            }}
            className="emotion-button"
            style={{
              fontSize: `${buttonPress ? "20px" : "10px"}`,
            }}
          >
            Samples
          </button>
        </div>
      </div>
      <div
        className="emotion-prediction-error"
        style={{
          opacity: `${error ? "1" : "0"}`,
          visibility: `${error ? "visible" : "hidden"}`,
        }}
      >
        {error.toUpperCase()}
      </div>
      {buttonPress && (
        <div className="emotion-prediction">
          <div className="emotion-graph">
            {labels.map((label, idx) => (
              <div className="emotion-cell" key={idx}>
                <div className="emotion-score">
                  {predictions[idx] && predictions[idx].score !== undefined
                    ? Math.round(predictions[idx].score * 100)
                    : 0}
                </div>
                <div
                  className="emotion-bar"
                  style={{
                    height: `${
                      predictions[idx]
                        ? Math.round(predictions[idx].score * 600)
                        : 0
                    }px`,
                  }}
                ></div>

                <div className="emotion-label">
                  <strong>{label}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        className="emotion-samples"
        style={{
          visibility: `${samplesOpen ? "visible" : "hidden"}`,
          opacity: `${samplesOpen ? "1" : "0"}`,
        }}
      >
        <div
          className="emotion-close"
          onClick={() => {
            setSamplesOpen(false);
          }}
        >
          CLOSE
        </div>
        {sentimentSamples.map((sentence, index) => (
          <div
            className="emotion-sample"
            key={index}
            onClick={() => {
              setInputText(sentence);
              setSamplesOpen(false);
            }}
          >
            {sentence}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmotionClassifier;
