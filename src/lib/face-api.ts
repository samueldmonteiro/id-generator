import * as faceapi from "@vladmandic/face-api";
import path from "path";

let loaded = false;

export async function loadFaceModels() {
  if (loaded) return;

  const modelPath = path.resolve("./public/models");

  await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);

  loaded = true;
  console.log("FaceAPI models loaded!");
}

export { faceapi };
