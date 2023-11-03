import diamondData from "./output.json";
import diamondIcon from "../assets/diamond-shapes/round.png";

const callDiamondApi = async () => {
  const response = await fetch(
    import.meta.env.VITE_DATA_PROVIDER_URL + "/diamonds"
  );
  const data = await response.json();
  return data;
};

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

  if (!videoLink || !videoLink.includes("view.gem360.in")) {
    videoLink = "";
    console.log("Video link not found for", sourceObj["Stock Id."]);
    console.log(sourceObj["Video Link"]);
  }

  return {
    id: sourceObj["Stock Id."] || null, // Default to null if undefined
    cert_id: "LG" + (sourceObj["Report"] || ""), // Append only if Report is defined
    image: diamondIcon, // Remains static
    shape: (sourceObj["Shape"] || "").toLowerCase(),
    specifications: {
      carat: (sourceObj["Carat"] || 0).toString(), // Default to '0' if Carat is undefined
      color: (sourceObj["Color"] || "").toUpperCase(),
      clarity: sourceObj["Clarity"] || "", // Default to empty string if Clarity is undefined
      cut: sourceObj["Cut"] ? sourceObj["Cut"].toUpperCase() : "Unknown",
    },
    finish: {
      polish: (sourceObj["Pol"] || "").toLowerCase(),
      symmetry: (sourceObj["Sym"] || "").toLowerCase(),
      fluorescence: (sourceObj["Fluro"] || "").toLowerCase(),
      fluorescence_color: "None", // Remains static
    },
    table_depth: {
      table: (sourceObj["Table"] || 0).toString(),
      depth: (sourceObj["Td"] || 0).toString(),
    },
    ratio_measurements: {
      ratio: (sourceObj["Ratio"] || 0).toString(),
      measurements: {
        width: sourceObj["L"] || 0, // Default to 0 if L is undefined
        height: sourceObj["W"] || 0, // Default to 0 if W is undefined
        depth: sourceObj["H"] || 0, // Default to 0 if H is undefined
      },
    },
    total: "1000", // Remains static
    video_link: videoLink || "", // Default to empty string if videoLink is undefined
  };
}

export const transformedList = (data) => {
  const diamondDataCollect = [];
  for (const item of data) {
    const diamondItem = getDiamondDataList(item);
    if (diamondItem) {
      diamondDataCollect.push(diamondItem);
    }
  }
  return diamondDataCollect;
};
