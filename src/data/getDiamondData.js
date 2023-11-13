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

  if (
    !videoLink ||
    (!videoLink.includes("view.gem360.in") &&
      !videoLink.includes("videos.gem360.in"))
  ) {
    videoLink = "";
    console.log("Video link not found for", sourceObj["Stock Id."]);
    console.log(sourceObj["Video Link"]);
  }

  return {
    id: sourceObj["Stock Id."] || null, // Default to null if undefined
    cert_id: "LG" + (sourceObj["Report"] || "N/A"), // Append only if Report is defined
    image: diamondIcon, // Remains static
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
      ratio: (sourceObj["Ratio"] || 0).toString(),
      measurements: {
        width: sourceObj["L"] || 0, // Default to 0 if L is undefined
        height: sourceObj["W"] || 0, // Default to 0 if W is undefined
        depth: sourceObj["H"] || 0, // Default to 0 if H is undefined
      },
    },
    total: "1000", // Remains static
    video_link: videoLink || "", // Default to empty string if videoLink is undefined
    crown_height: (sourceObj["Crown Height"] || 0).toString(),
    crown_angle: (sourceObj["Crown Angle"] || 0).toString(),
    pavilion_depth: (sourceObj["Pavilion Depth"] || 0).toString(),
    pavilion_angle: (sourceObj["Pavilion Angle"] || 0).toString(),
    girdle: sourceObj["Girdle"] || "N/A",
    culet: sourceObj["Culet"] || "N/A",
    canada: sourceObj["Canada Mark"] || "N/A",
    forever: sourceObj["Forever Mark"] || "N/A",
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
