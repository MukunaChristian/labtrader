import diamondData from "./output.json";

import diamondIcon from "../assets/diamond-shapes/round.png";
import asscherIcon from "../assets/diamond-shapes/asscher.png";
import emeraldIcon from "../assets/diamond-shapes/emerald.png";
import heartIcon from "../assets/diamond-shapes/heart.png";
import marquiseIcon from "../assets/diamond-shapes/marquise.png";
import ovalIcon from "../assets/diamond-shapes/oval.png";
import pearIcon from "../assets/diamond-shapes/pear.png";
import princessIcon from "../assets/diamond-shapes/princess.png";
import radiantIcon from "../assets/diamond-shapes/radiant.png";
import cushionIcon from "../assets/diamond-shapes/cushion.png";
import oldMinerIcon from "../assets/diamond-shapes/old-miner.png";
import squareEmeraldIcon from "../assets/diamond-shapes/square-emerald.png";
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

function transformDBData(sourceObj) {
  // fit diamond data into default object structure
  //console.log(sourceObj["Shape"]);

  let imageIcon;
  // check if shape is in imageHashMap
  if (sourceObj["shape"].toLowerCase() in imageHashMap) {
    imageIcon = imageHashMap[sourceObj["shape"].toLowerCase()];
  } else {
    imageIcon = defaultIcon;
  }

  let total;
  if (!(sourceObj["total"] === "0")) {
    total = sourceObj["total"];
  }

  let videoLink = sourceObj["video_link"];
  if (
    !videoLink ||
    (!videoLink.includes("view.gem360.in") &&
      !videoLink.includes("videos.gem360.in") &&
      !videoLink.includes("loupe360.com") &&
      !videoLink.includes("viw-us.s3.amazonaws.com"))
  ) {
    videoLink = "";
  }

  return {
    id: sourceObj["stock_id"] || null, // Default to null if undefined
    cert_id: sourceObj["cert_id"] || "N/A", // Append only if Report is defined
    certificate: (sourceObj["certificate"] || "IGI").toUpperCase(),
    image: imageIcon, // Remains static
    shape: (sourceObj["shape"] || "N/A").toLowerCase(),
    specifications: {
      carat: (sourceObj["carat"] || 0).toString(), // Default to '0' if Carat is undefined
      color: (sourceObj["color"] || "N/A").toUpperCase(),
      clarity: sourceObj["clarity"] || "N/A", // Default to empty string if Clarity is undefined
      cut: sourceObj["cut"] ? sourceObj["cut"].toUpperCase() : "Unknown",
    },
    finish: {
      polish: (sourceObj["polish"] || "N/A").toLowerCase(),
      symmetry: (sourceObj["symmetry"] || "N/A").toLowerCase(),
      fluorescence: (sourceObj["fluorescence"] || "N/A").toLowerCase(),
      fluorescence_color: "None", // Remains static
    },
    table_depth: {
      table: (sourceObj["table_percent"] || 0).toString(),
      depth: (sourceObj["depth_percent"] || 0).toString(),
    },
    ratio_measurements: {
      ratio: sourceObj["ratio"],
      measurements: {
        width: sourceObj["width"] || 0, // Default to 0 if L is undefined
        height: sourceObj["height"] || 0, // Default to 0 if W is undefined
        depth: sourceObj["depth"] || 0, // Default to 0 if H is undefined
      },
    },
    total: total, // Remains static
    video_link: sourceObj["video_link"] || "", // Default to empty string if videoLink is undefined
    crown_height: (sourceObj["crown_height"] || 0).toString(),
    crown_angle: (sourceObj["crown_angle"] || 0).toString(),
    pavilion_depth: (sourceObj["pavilion_depth"] || 0).toString(),
    pavilion_angle: (sourceObj["pavilion_angle"] || 0).toString(),
    girdle: sourceObj["girdle"] || "N/A",
    culet: sourceObj["culet"] || "N/A",
    canada: sourceObj["canada_mark"] || "N/A",
    forever: sourceObj["forever_mark"] || "N/A",
    location: sourceObj["location"] || "Location N/A",
    company: sourceObj["company"] || "Lab N/A",
    amount: sourceObj["stock_amount"],
    amount_in_cart: 1,
    diamond_type_id: sourceObj["diamond_type_id"] || "N/A",
    size_from: sourceObj["size_from"] || null,
    size_to: sourceObj["size_to"] || null,
  };
}

export const transformedList = (data) => {
  const diamondDataCollect = [];
  for (const item of data) {
    const diamondItem = transformDBData(item);

    if (diamondItem) {
      diamondDataCollect.push(diamondItem);
    }
  }
  return diamondDataCollect;
};
