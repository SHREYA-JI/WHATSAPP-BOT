const { cmd } = require("../command");
const { alldl } = require('rahad-all-downloader');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');


cmd({
  pattern: "video",
  react: '🎥',
  desc: "Download YouTube video by searching for keywords.",
  category: "main",
  use: ".ytvideo <video name or keywords>",
  filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      return reply(`❗️ Please provide a video name or keywords. 📝\nExample: .ytvideo Despacito`);
    }


    reply("🔍 Searching for the video... 🎥");


    const searchResults = await yts(searchQuery);
    if (!searchResults.videos.length) {
      return reply(`❌ No results found for "${searchQuery}". 😔`);
    }


    const videoUrl = searchResults.videos[0].url;
    const Filename = searchResults.videos[0].title.replace(/[^a-zA-Z0-9]/g, '_');


    const result = await alldl(videoUrl);
    const videoDownloadUrl = result.data.videoUrl;
    const videoFilePath = path.join('./downloads', `${Filename}.mp4`);


    const videoResponse = await fetch(videoDownloadUrl);
    const videoArrayBuffer = await videoResponse.arrayBuffer();
    const videoBuffer = Buffer.from(videoArrayBuffer);
    fs.writeFileSync(videoFilePath, videoBuffer);


    await conn.sendMessage(from, {
      video: fs.readFileSync(videoFilePath),
      mimetype: "video/mp4",
      caption: `elama`
    }, { quoted: mek });


    console.log(`Video downloaded successfully: ${videoFilePath}`);
  } catch (error) {
    console.error('Error:', error.message);
    reply("❌ An error occurred while processing your request. 😢");
  }
});
