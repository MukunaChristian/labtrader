import diamondData from "./output.json";

import diamondIcon from "../assets/diamond-shapes/round.png";
import asscherIcon from "../assets/diamond-shapes/asscher.png";
import emeraldIcon from "../assets/diamond-shapes/emerald.png";
import heartIcon from "../assets/diamond-shapes/heart.png";
import marquiseIcon from "../assets/diamond-shapes/marquise.png";
import ovalIcon from "../assets/diamond-shapes/oval.jpg";
import pearIcon from "../assets/diamond-shapes/pear.png";
import princessIcon from "../assets/diamond-shapes/princess.png";
import radiantIcon from "../assets/diamond-shapes/radiant.png";
import cushionIcon from "../assets/diamond-shapes/cushion.png";
import oldMinerIcon from "../assets/diamond-shapes/old-miner.png";
import squareEmeraldIcon from "../assets/diamond-shapes/square-emerald.jpg";
import defaultIcon from "../assets/diamond-shapes/diamond.png";

const imageHashMap = {
  round: diamondIcon,
  asscher: asscherIcon,
  emerald: emeraldIcon,
  heart: heartIcon,
  marquise: marquiseIcon,
  oval: ovalIcon,
  pear: pearIcon,
  princess: princessIcon,
  radiant: radiantIcon,
  "square emerald": squareEmeraldIcon,
  "square radiant": radiantIcon,
  cushion: cushionIcon,
  "cushion bril modified": cushionIcon,
  "old miner": oldMinerIcon,
};

const callDiamondApi = async () => {
  const response = await fetch(
    import.meta.env.VITE_DATA_PROVIDER_URL + "/diamonds"
  );
  const data = await response.json();
  return data;
};

function getRandomNumberInRange() {
  const min = 1000;
  const max = 2500;
  const increment = 100;

  // Calculate the number of increments between min and max
  const numIncrements = (max - min) / increment;

  // Generate a random number within the range of increments
  const randomIncrement = Math.floor(Math.random() * (numIncrements + 1));

  // Calculate the final number
  return min + randomIncrement * increment;
}

function getDiamondDataList(sourceObj) {
  // fit diamond data into default object structure
  let videoLink = sourceObj["Video Link"];

  if (Object.keys(sourceObj).length === 0 || !sourceObj["Stock Id."]) {
    return false;
  }

  if (videoLink && !videoLink.startsWith("https")) {
    // replace http with https
    videoLink = videoLink.replace("http", "https");
  }

  if (
    !videoLink ||
    (!videoLink.includes("view.gem360.in") &&
      !videoLink.includes("videos.gem360.in"))
  ) {
    videoLink = "";
  }

  //console.log(sourceObj["Shape"]);

  let imageIcon;
  // check if shape is in imageHashMap
  if (sourceObj["Shape"].toLowerCase() in imageHashMap) {
    imageIcon = imageHashMap[sourceObj["Shape"].toLowerCase()];
  } else {
    imageIcon = defaultIcon;
  }

  let price;
  if (
    typeof sourceObj["Price Per Carat"] === "number" &&
    sourceObj["Price Per Carat"] > 0 &&
    sourceObj["Carat"]
  ) {
    price = sourceObj["Price Per Carat"] * sourceObj["Carat"];
  }
  // } else {
  //   price = getRandomNumberInRange();
  // }

  return {
    id: sourceObj["Stock Id."] || null, // Default to null if undefined
    cert_id: sourceObj["Report"] || "N/A", // Append only if Report is defined
    image: imageIcon, // Remains static
    shape: (sourceObj["Shape"] || "N/A").toLowerCase(),
    specifications: {
      carat: (sourceObj["Carat"] || 0).toString(), // Default to '0' if Carat is undefined
      color: (sourceObj["Color"] || "N/A").toUpperCase(),
      clarity: sourceObj["Clarity"] || "N/A", // Default to empty string if Clarity is undefined
      cut: sourceObj["Cut"] ? sourceObj["Cut"].toUpperCase() : "Unknown",
    },
    finish: {
      polish: (sourceObj["Pol"] || "N/A").toLowerCase(),
      symmetry: (sourceObj["Sym"] || "N/A").toLowerCase(),
      fluorescence: (sourceObj["Fluro"] || "N/A").toLowerCase(),
      fluorescence_color: "None", // Remains static
    },
    table_depth: {
      table: (sourceObj["Table"] || 0).toString(),
      depth: (sourceObj["Td"] || 0).toString(),
    },
    ratio_measurements: {
      ratio: (sourceObj["Table"] && sourceObj["Td"]
        ? sourceObj["Td"] / sourceObj["Table"]
        : 0
      )
        .toFixed(2)
        .toString(),
      measurements: {
        width: sourceObj["L"] || 0, // Default to 0 if L is undefined
        height: sourceObj["W"] || 0, // Default to 0 if W is undefined
        depth: sourceObj["H"] || 0, // Default to 0 if H is undefined
      },
    },
    total: price, // Remains static
    video_link: videoLink || "", // Default to empty string if videoLink is undefined
    crown_height: (sourceObj["Crown Height"] || 0).toString(),
    crown_angle: (sourceObj["Crown Angle"] || 0).toString(),
    pavilion_depth: (sourceObj["Pavilion Depth"] || 0).toString(),
    pavilion_angle: (sourceObj["Pavilion Angle"] || 0).toString(),
    girdle: sourceObj["Girdle"] || "N/A",
    culet: sourceObj["Culet"] || "N/A",
    canada: sourceObj["Canada Mark"] || "N/A",
    forever: sourceObj["Forever Mark"] || "N/A",
    location: sourceObj["Location"] || "Location N/A",
    company: sourceObj["Lab"] || "Lab N/A",
  };
}

export const transformedList = (data) => {
  const diamondDataCollect = [];
  console.log(data.length);
  for (const item of data) {
    const diamondItem = getDiamondDataList(item);
    if (diamondItem) {
      diamondDataCollect.push(diamondItem);
    }
  }
  return diamondDataCollect;
};
