import diamondData from "./output.json";

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

  if (!videoLink.startsWith("https")) {
    // replace http with https
    videoLink = videoLink.replace("http", "https");
  }

  if (!videoLink.includes("view.gem360.in")) {
    videoLink = "";
  }

  return {
    id: sourceObj["Stock Id."], // Assuming the 'K' in "K351" can be ignored
    cert_id: "LG" + sourceObj["Report"],
    image: "src/assets/diamond-shapes/round.png", // This is static in your example
    shape: sourceObj["Shape"].toLowerCase(),
    specifications: {
      carat: sourceObj["Carat"].toString(),
      color: sourceObj["Color"].toUpperCase(), // Extracting last word as color
      clarity: sourceObj["Clarity"],
      cut: sourceObj["Cut"].toUpperCase() || "Unknown", // Default to "Unknown" if cut is empty
    },
    finish: {
      polish: sourceObj["Pol"].toLowerCase(),
      symmetry: sourceObj["Sym"].toLowerCase(),
      fluorescence: sourceObj["Fluro"].toLowerCase(),
      fluorescence_color: "None", // Static value, adjust as needed
    },
    table_depth: {
      table: sourceObj["Table"].toString(),
      depth: sourceObj["Td"].toString(),
    },
    ratio_measurements: {
      ratio: sourceObj["Ratio"].toString(),
      measurements: {
        width: sourceObj["L"],
        height: sourceObj["W"],
        depth: sourceObj["H"],
      },
    },
    total: "1000", // This value is static in your example
    video_link: videoLink,
  };
}

export const transformedList = (data) => {
  const diamondDataCollect = [];
  for (const item of diamondData) {
    const diamondItem = getDiamondDataList(item);
    if (diamondItem) {
      diamondDataCollect.push(diamondItem);
    }
  }
  return diamondDataCollect;
};
