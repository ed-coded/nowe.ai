import { Client } from "@gradio/client";

const response_0 = await fetch("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav");
const exampleAudio = await response_0.blob();

const client = await Client.connect("Willie999/Kasapa-ASR-App");
const result = await client.predict("/transcribe", {
		audio: exampleAudio,
});

console.log(result.data);
