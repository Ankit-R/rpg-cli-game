#!/usr/bin/env node
const fs = require("fs");
const inquirer = require("inquirer");

const GAME_OPTIONS = {
  type: "list",
  message: "Select a game to play",
  name: "selectedGame",
  choices: ["Treasure Hunt", "How to defeat your dragon"],
};

const prompt = inquirer.createPromptModule();

const playScene = (scenes, stage) => {
  const scene = scenes[stage];
  if (!scene.choices.length) {
    console.log(scene.description);
    return;
  }
  const sceneOptions = {
    type: "list",
    name: "selectedScene",
    message: scene.description,
    choices: scene.choices.map((choice) => choice.option),
  };

  prompt(sceneOptions).then((answers) => {
    const nextScene = scene.choices.find(
      (choice) => choice.option == answers["selectedScene"]
    ).nextScene;
    // console.log(JSON.stringify(answers));

    playScene(scenes, nextScene);
  });
};

const startGame = (scenes) => playScene(scenes, "start");

prompt(GAME_OPTIONS).then((answers) => {
  const fileName =
    answers["selectedGame"] === "Treasure Hunt"
      ? "demo-game-story.json"
      : "dragon-game-story.json";

  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) throw err;
    startGame(JSON.parse(data)["scenes"]);
  });
});
